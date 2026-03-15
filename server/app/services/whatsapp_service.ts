import { Client, LocalAuth } from 'whatsapp-web.js'

export default class WhatsAppService {
  private client: Client
  private isReady: boolean = false

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'mymeal'   // session folder name
      }),
      puppeteer: {
        headless: true
      }
    })

    this.initialize()
  }

  private initialize() {
    this.client.on('qr', (qr) => {
      console.log('\nScan this QR in WhatsApp:\n')
      console.log(qr)
    })

    this.client.on('ready', () => {
      console.log('✅ WhatsApp Client Ready')
      this.isReady = true
    })

    this.client.on('auth_failure', () => {
      console.log('❌ Auth failed')
    })

    this.client.on('disconnected', () => {
      console.log('⚠️ WhatsApp disconnected')
      this.isReady = false
    })

    this.client.initialize()
  }

  /**
   * Send WhatsApp message
   */
  public async sendMessage(phone: string, text: string) {
    try {
      if (!this.isReady) {
        console.log('WhatsApp not ready yet')
        return false
      }

      const waId = this.formatPhone(phone)

      await this.client.sendMessage(waId, text)

      console.log(`✅ Message sent to ${phone}`)
      return true
    } catch (error) {
      console.error('❌ WhatsApp send failed:', error)
      return false
    }
  }

  /**
   * Convert phone → WhatsApp ID
   */
  private formatPhone(phone: string) {
    const cleaned = phone.replace(/\D/g, '')
    return `${cleaned}@c.us`
  }
}