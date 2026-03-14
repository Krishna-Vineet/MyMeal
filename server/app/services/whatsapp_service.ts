import env from '#start/env'

export default class WhatsAppService {
  /**
   * Send a WhatsApp message
   * @param phone Consumer or Cook phone number
   * @param text Message body
   */
  public async sendMessage(phone: string, text: string) {
    const apiKey = env.get('WA_API_KEY')

    if (!apiKey) {
      console.log(`\n--- WHATSAPP SIMULATION (API KEY MISSING) ---`)
      console.log(`TO: ${phone}`)
      console.log(`MESSAGE: ${text}`)
      console.log(`---------------------------\n`)
      return true
    }

    try {
      // Mocking the call to WhatsApp Business API
      // Since I don't have the exact endpoint from the user yet, I'll use a placeholder.
      // But I'll structured it correctly for a real API.
      const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: text },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('WhatsApp API Error:', errorData)
        return false
      }

      console.log(`WhatsApp message sent to ${phone}`)
      return true
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error)
      return false
    }
  }
}
