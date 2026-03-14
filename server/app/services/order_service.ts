import Subscription from '#models/subscription'
import Order from '#models/order'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import PaymentService from '#services/payment_service'

export default class OrderService {
  /**
   * Calculate daily price based on meal plan and customization
   */
  private async getDailyPrice(subscription: Subscription) {
    await subscription.load('mealPlan')
    await subscription.load('subscribedMealComponents')
    
    const basePrice = Number(subscription.mealPlan.basePrice)
    const extraPrice = subscription.subscribedMealComponents
      .filter(c => c.enabled)
      .reduce((acc, curr) => acc + (Number(curr.price) * (curr.quantity || 1)), 0)
    
    return basePrice + extraPrice
  }

  /**
   * Detect if a date is valid for a given validity type
   */
  private isValidDay(date: DateTime, validityType: string): boolean {
    const day = date.weekday // 1-7 (Mon-Sun)
    if (validityType === 'weekdays') return day <= 5
    if (validityType === 'weekends') return day >= 6
    if (validityType === 'all_days') return true
    return false
  }

  /**
   * Generate orders for a subscription for its entire duration
   */
  public async generateOrders(subscription: Subscription) {
    await subscription.load('mealPlan')
    const start = subscription.startDate
    const end = subscription.endDate
    
    if (!start || !end) return

    const dailyPrice = await this.getDailyPrice(subscription)
    const ordersData: any[] = []

    let current = start
    while (current <= end) {
      if (this.isValidDay(current, subscription.mealPlan.validityType)) {
        ordersData.push({
          subscriptionId: subscription.id,
          orderDate: current.toSQLDate(),
          status: 'scheduled',
          price: dailyPrice,
          pickupSlotId: subscription.pickupSlotId
        })
      }
      current = current.plus({ days: 1 })
    }

    if (ordersData.length > 0) {
      await Order.createMany(ordersData)
    }
  }

  /**
   * Handle re-generation of orders on resume
   */
  public async handleSubscriptionResume(subscription: Subscription) {
    await subscription.load('mealPlan')
    const today = DateTime.now().startOf('day')
    const end = subscription.endDate

    if (!end || today > end) return

    const dailyPrice = await this.getDailyPrice(subscription)
    const ordersData: any[] = []

    let current = today
    while (current <= end) {
      // Check if order already exists for this date
      const existing = await Order.query()
        .where('subscriptionId', subscription.id)
        .where('orderDate', current.toSQLDate())
        .first()

      if (!existing && this.isValidDay(current, subscription.mealPlan.validityType)) {
        ordersData.push({
          subscriptionId: subscription.id,
          orderDate: current.toSQLDate(),
          status: 'scheduled',
          price: dailyPrice,
          pickupSlotId: subscription.pickupSlotId
        })
      }
      current = current.plus({ days: 1 })
    }

    if (ordersData.length > 0) {
      await Order.createMany(ordersData)
    }
  }

  /**
   * Delete future scheduled orders on pause
   */
  public async handleSubscriptionPause(subscription: Subscription) {
    const today = DateTime.now().toSQLDate()!
    await Order.query()
      .where('subscriptionId', subscription.id)
      .where('status', 'scheduled')
      .where('orderDate', '>=', today)
      .delete()
  }

  /**
   * Sync future orders on edit (Re-calculate price and components)
   */
  public async handleSubscriptionEdit(subscription: Subscription) {
    const today = DateTime.now().toSQLDate()!
    
    // 1. Delete future scheduled orders
    await Order.query()
      .where('subscriptionId', subscription.id)
      .where('status', 'scheduled')
      .where('orderDate', '>=', today)
      .delete()

    // 2. Re-generate
    await this.handleSubscriptionResume(subscription)
  }

  /**
   * Sync financial status when order is completed or missed
   */
  public async syncFinancials(order: Order, status: 'picked_up' | 'missed') {
    const trx = await db.transaction()
    try {
      order.useTransaction(trx)
      order.status = status
      await order.save()

      const subscription = await Subscription.findOrFail(order.subscriptionId)
      subscription.useTransaction(trx)
      
      const price = Number(order.price)
      subscription.amountConsumed = (Number(subscription.amountConsumed) + price).toString()
      
      await subscription.save()

      // 4. Update Cook Wallet
      const paymentService = new PaymentService()
      await paymentService.updateCookWallet(subscription.mealPlan.cookId, price)

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Auto-transition 'prepared' orders to 'missed' after 3 hours
   */
  public async handleAutoMissed() {
    // This is a bit complex because pickupTime is a string "HH:mm" in PickupSlot
    // We need to find orders that were 'prepared' but not 'picked_up'
    const orders = await Order.query()
      .where('status', 'prepared')
      .where('orderDate', '<=', DateTime.now().toSQLDate())
      .preload('subscription', (q) => q.preload('pickupSlot'))

    for (const order of orders) {
      const slot = order.subscription.pickupSlot
      if (!slot || !slot.pickupTime) continue

      // Construct pickup full datetime
      const [hours, minutes] = slot.pickupTime.split(':').map(Number)
      const pickupDateTime = order.orderDate!.set({ hour: hours, minute: minutes })

      if (DateTime.now() > pickupDateTime.plus({ hours: 3 })) {
        await this.syncFinancials(order, 'missed')
      }
    }
  }
}
