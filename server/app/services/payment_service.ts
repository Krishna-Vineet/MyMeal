import Payment from '#models/payment'
import Subscription from '#models/subscription'
import CookProfile from '#models/cook_profile'
import NotificationService from '#services/notification_service'
import db from '@adonisjs/lucid/services/db'

const notifications = new NotificationService()

export default class PaymentService {
  /**
   * Process a payment (Deposit/Topup)
   */
  public async processPayment(data: {
    userId: string,
    subscriptionId: string,
    amount: number,
    method: string,
    type: 'advance' | 'topup' | 'settlement'
  }) {
    const trx = await db.transaction()
    
    try {
      // 1. Create Payment Record
      const payment = await Payment.create(data, { client: trx })
      
      // 2. Update Subscription Ledger
      const subscription = await Subscription.findOrFail(data.subscriptionId, { client: trx })
      subscription.amountPaid = (Number(subscription.amountPaid) + data.amount).toString()
      await subscription.save()
      
      await trx.commit()
      
      // 3. Send Notification (Async)
      notifications.notifyPaymentSuccess(payment).catch(console.error)
      
      return payment
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Update Cook Wallet when order is fulfilled
   */
  public async updateCookWallet(cookId: string, amount: number) {
    const cook = await CookProfile.findOrFail(cookId)
    cook.wallet = (Number(cook.wallet) + amount).toString()
    await cook.save()
    
    // Notify Cook
    notifications.notifyCookEarnings(cook, amount).catch(console.error)
  }

  /**
   * Simulate a payout to the cook
   */
  public async processPayout(cookId: string, amount: number) {
    const cook = await CookProfile.findOrFail(cookId)
    const currentWallet = Number(cook.wallet)
    
    if (currentWallet < amount) {
      throw new Error('Insufficient wallet balance')
    }
    
    const trx = await db.transaction()
    try {
      cook.useTransaction(trx)
      cook.wallet = (currentWallet - amount).toString()
      await cook.save()
      
      // Create a payment record of type 'payout' for tracking
      await Payment.create({
        userId: cook.userId,
        amount: amount,
        method: 'transfer',
        type: 'payout',
        status: 'completed'
      }, { client: trx })
      
      await trx.commit()
      
      // Notify Cook
      notifications.notifyPayoutSuccess(cook, amount).catch(console.error)
      
      return true
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
