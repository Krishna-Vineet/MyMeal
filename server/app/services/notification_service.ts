import WhatsAppService from '#services/whatsapp_service'
import Payment from '#models/payment'
import CookProfile from '#models/cook_profile'
import User from '#models/user'
import OrderNote from '#models/order_note'

const whatsapp = new WhatsAppService()

export default class NotificationService {
  /**
   * Notify user about payment success
   */
  public async notifyPaymentSuccess(payment: Payment) {
    await payment.load('user')
    await payment.load('subscription', (q: any) => q.preload('mealPlan'))
    
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

  /**
   * Notify about a new order note
   */
  public async notifyNewOrderNote(orderNote: OrderNote) {
    await orderNote.load('order', (q) => q.preload('subscription', (sq) => sq.preload('mealPlan', (mq) => mq.preload('cook', (cq) => cq.preload('user')))))
    await orderNote.load('user')
    
    const noteAuthor = orderNote.user as unknown as User
    const order = orderNote.order
    const subscription = order.subscription
    const mealPlan = subscription.mealPlan
    const cook = mealPlan.cook
    const cookUser = cook.user as unknown as User
    const consumer = (await User.find(subscription.userId))!

    let recipientPhone: string
    let message: string

    if (noteAuthor.id === consumer.id) {
        // Consumer wrote the note, notify cook
        recipientPhone = cook.phone || cookUser.phone || 'Unknown'
        message = `Hi ${cook.kitchenName}! 📝 ${consumer.name} added a note to their order for "${mealPlan.title}" on ${order.orderDate}: "${orderNote.note}"`
    } else {
        // Cook wrote the note, notify consumer
        recipientPhone = consumer.phone || 'Unknown'
        message = `Hi ${consumer.name}! 📝 Your cook (${cook.kitchenName}) added a note to your order for "${mealPlan.title}" on ${order.orderDate}: "${orderNote.note}"`
    }

    await whatsapp.sendMessage(recipientPhone, message)
  }
}
