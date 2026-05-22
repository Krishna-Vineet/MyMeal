import { createRequire } from 'node:module'
import env from '#start/env'

const require = createRequire(import.meta.url)

type WwebModule = {
  Client: new (options: Record<string, unknown>) => WhatsAppClient
  LocalAuth: new (options: { clientId: string }) => unknown
}

type WhatsAppClient = {
  initialize: () => void
  on: (event: string, cb: (...args: unknown[]) => void) => void
  sendMessage: (jid: string, text: string) => Promise<unknown>
}

function loadWhatsappWeb(): WwebModule {
  return require('whatsapp-web.js') as WwebModule
}

/**
 * WhatsApp Web.js is CommonJS; named ESM imports break under Node's interop.
 * Off by default (WHATSAPP_ENABLED=false) so subscriptions/payments never load Puppeteer.
 * One shared client process-wide.
 */
export default class WhatsAppService {
  private static client: WhatsAppClient | null = null
  private static isReady = false
  private static initStarted = false

  private static ensureClient(): WhatsAppClient | null {
    if (env.get('WHATSAPP_ENABLED') !== true) {
      return null
    }
    if (WhatsAppService.client) {
      return WhatsAppService.client
    }
    if (WhatsAppService.initStarted) {
      return null
    }
    WhatsAppService.initStarted = true

    const { Client, LocalAuth } = loadWhatsappWeb()
    WhatsAppService.client = new Client({
      authStrategy: new LocalAuth({ clientId: 'mymeal' }),
      puppeteer: { headless: true },
    }) as WhatsAppClient

    WhatsAppService.client.on('qr', (qr) => {
      console.log('\n[WhatsApp] Scan QR in WhatsApp:\n', qr)
    })

    WhatsAppService.client.on('ready', () => {
      console.log('[WhatsApp] Client ready')
      WhatsAppService.isReady = true
    })

    WhatsAppService.client.on('auth_failure', () => {
      console.log('[WhatsApp] Auth failed')
      WhatsAppService.isReady = false
    })

    WhatsAppService.client.on('disconnected', () => {
      console.log('[WhatsApp] Disconnected')
      WhatsAppService.isReady = false
    })

    WhatsAppService.client.initialize()
    return WhatsAppService.client
  }

  public async sendMessage(phone: string, text: string) {
    if (env.get('WHATSAPP_ENABLED') !== true) {
      console.log('[WhatsApp disabled] would send:', text.slice(0, 120))
      return false
    }

    const client = WhatsAppService.ensureClient()
    if (!client || !WhatsAppService.isReady) {
      console.log('[WhatsApp] Not ready yet; skipping send')
      return false
    }

    try {
      const waId = WhatsAppService.formatPhone(phone)
      await client.sendMessage(waId, text)
      console.log(`[WhatsApp] Sent to ${phone}`)
      return true
    } catch (error) {
      console.error('[WhatsApp] send failed:', error)
      return false
    }
  }

  private static formatPhone(phone: string) {
    const cleaned = phone.replace(/\D/g, '')
    return `${cleaned}@c.us`
  }
}
