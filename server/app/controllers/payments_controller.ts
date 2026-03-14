import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import PaymentService from '#services/payment_service'
import vine from '@vinejs/vine'

const paymentService = new PaymentService()

export default class PaymentsController {
  /**
   * Process a new payment (Consumer side)
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    
    const schema = vine.compile(
      vine.object({
        subscriptionId: vine.string().uuid(),
        amount: vine.number().positive(),
        method: vine.string(),
        type: vine.enum(['advance', 'topup', 'settlement' as const])
      })
    )
    
    const data = await request.validateUsing(schema)
    
    const payment = await paymentService.processPayment({
      ...data,
      userId: user.id
    })
    
    return response.created(payment)
  }

  /**
   * List payments for a subscription
   */
  async index({ auth, params, response }: HttpContext) {
    const subscriptionId = params.id
    const user = auth.user!
    
    const payments = await Payment.query()
      .where('subscriptionId', subscriptionId)
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')
      
    return response.ok(payments)
  }

  /**
   * Cook Wallet Status
   */
  async walletStatus({ auth, response }: HttpContext) {
    const user = auth.user!
    const cookProfile = await user.related('cookProfile').query().first()
    
    if (!cookProfile) return response.unauthorized({ message: 'Not a cook' })
    
    return response.ok({
      walletBalance: cookProfile.wallet,
      kitchenName: cookProfile.kitchenName
    })
  }

  /**
   * Payout Request (Cook side)
   */
  async payout({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const cookProfile = await user.related('cookProfile').query().first()
    
    if (!cookProfile) return response.unauthorized({ message: 'Not a cook' })
    
    const amount = request.input('amount')
    if (!amount || amount <= 0) return response.badRequest({ message: 'Invalid payout amount' })
    
    try {
      await paymentService.processPayout(cookProfile.id, amount)
      return response.ok({ message: 'Payout initiated successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
