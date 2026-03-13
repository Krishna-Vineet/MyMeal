import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import { DateTime } from 'luxon'

export default class OrdersController {
  /**
   * List orders for cook (7-day calendar view)
   */
  async indexForCook({ auth, response }: HttpContext) {
    const user = auth.user!
    const cookProfile = await user.related('cookProfile').query().first()
    if (!cookProfile) return response.unauthorized({ message: 'Cook profile not found' })

    const today = DateTime.now().startOf('day')
    const sevenDaysLater = today.plus({ days: 7 }).endOf('day')

    const orders = await Order.query()
      .whereHas('subscription', (subQuery) => {
        subQuery.whereHas('mealPlan', (planQuery) => {
          planQuery.where('cookId', cookProfile.id)
        })
      })
      .whereBetween('orderDate', [today.toSQLDate()!, sevenDaysLater.toSQLDate()!])
      .preload('subscription', (q) => {
        q.preload('user')
        q.preload('mealPlan')
        q.preload('pickupSlot')
        q.preload('subscribedMealComponents', (sq) => sq.where('enabled', true).preload('mealComponent'))
      })
      .preload('note')
      .orderBy('orderDate', 'asc')

    // Grouping by date
    const groupedOrders = orders.reduce((acc, order) => {
      const dateKey = order.orderDate!.toISODate()!
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(order)
      return acc
    }, {} as Record<string, Order[]>)

    return response.ok(groupedOrders)
  }

  /**
   * List orders for consumer (Order history)
   */
  async indexForConsumer({ auth, response }: HttpContext) {
    const user = auth.user!

    const orders = await Order.query()
      .whereHas('subscription', (q) => q.where('userId', user.id))
      .preload('subscription', (q) => {
        q.preload('mealPlan', (pq) => pq.preload('cook'))
        q.preload('pickupSlot')
      })
      .preload('note')
      .orderBy('orderDate', 'desc')

    return response.ok(orders)
  }

  /**
   * Update order status (prepared, picked_up)
   */
  async updateStatus({ params, request, auth, response }: HttpContext) {
    const id = params.id
    const status = request.input('status')
    
    // Only 'prepared' and 'picked_up' can be set manually by cook
    if (!['prepared', 'picked_up'].includes(status)) {
        return response.badRequest({ message: 'Invalid status update' })
    }

    const order = await Order.query()
      .where('id', id)
      .preload('subscription', (q) => q.preload('mealPlan'))
      .first()

    if (!order) return response.notFound({ message: 'Order not found' })

    // Authorization: only the cook of this meal plan can update status
    const user = auth.user!
    const cookProfile = await user.related('cookProfile').query().first()
    if (!cookProfile || order.subscription.mealPlan.cookId !== cookProfile.id) {
        return response.forbidden({ message: 'You are not authorized to update this order' })
    }

    if (status === 'picked_up') {
        const OrderService = (await import('#services/order_service')).default
        const orderService = new OrderService()
        await orderService.syncFinancials(order, 'picked_up')
    } else {
        order.status = status
        await order.save()
    }

    return response.ok({ message: `Order marked as ${status}`, order })
  }
}
