import WhatsAppService from '#services/whatsapp_service'
import Payment from '#models/payment'
import CookProfile from '#models/cook_profile'
import User from '#models/user'

const whatsapp = new WhatsAppService()

export default class NotificationService {
  /**
   * Notify user about payment success
   */
  public async notifyPaymentSuccess(payment: Payment) {
    await payment.load('user')
    await payment.load('subscription', (q) => q.preload('mealPlan'))
    
    const user = payment.user as unknown as User
    const mealPlan = payment.subscription.mealPlan
    
    const message = `Hi ${user.name}! 🥗 Your payment of ₹${payment.amount} for "${mealPlan.title}" has been received. Your subscription balance is updated.`
    
    await whatsapp.sendMessage(user.phone || 'Unknown', message)
  }

  /**
   * Notify cook about new earnings in wallet
   */
  public async notifyCookEarnings(cook: CookProfile, amount: number) {
    const user = cook.user as unknown as User
    const message = `Namaste ${cook.kitchenName}! 💰 You just earned ₹${amount} for a meal fulfillment. This has been added to your MyMeal wallet.`
    
    await whatsapp.sendMessage(cook.phone || user?.phone || 'Unknown', message)
  }

  /**
   * Notify cook about payout success
   */
  public async notifyPayoutSuccess(cook: CookProfile, amount: number) {
    const user = cook.user as unknown as User
    const message = `Heads up ${cook.kitchenName}! 💸 A payout of ₹${amount} has been initiated from your MyMeal wallet to your linked account.`
    
    await whatsapp.sendMessage(cook.phone || user?.phone || 'Unknown', message)
  }
}
