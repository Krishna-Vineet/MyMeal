import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderNote from '#models/order_note'
import NotificationService from '#services/notification_service'

const notificationService = new NotificationService()

export default class OrderNotesController {
  /**
   * Add a note to an order
   */
  async store({ params, request, auth, response }: HttpContext) {
    const orderId = params.id
    const noteContent = request.input('note')

    if (!noteContent) return response.badRequest({ message: 'Note content is required' })

    const order = await Order.query()
      .where('id', orderId)
      .preload('subscription', (q) => q.preload('mealPlan'))
      .first()

    if (!order) return response.notFound({ message: 'Order not found' })

    const user = auth.user!
    
    // Authorization: User must be either the consumer or the cook
    const isConsumer = order.subscription.userId === user.id
    const cookProfile = await user.related('cookProfile').query().first()
    const isCook = cookProfile && order.subscription.mealPlan.cookId === cookProfile.id

    if (!isConsumer && !isCook) {
        return response.forbidden({ message: 'You are not authorized to add notes to this order' })
    }

    const note = await OrderNote.create({
      orderId,
      userId: user.id,
      note: noteContent
    })

    // Trigger notification async
    notificationService.notifyNewOrderNote(note).catch(err => console.error('Failed to notify order note:', err))

    return response.created(note)
  }

  /**
   * Get notes for an order
   */
  async index({ params, auth, response }: HttpContext) {
    const orderId = params.id
    const order = await Order.query().where('id', orderId).preload('subscription', (q) => q.preload('mealPlan')).first()

    if (!order) return response.notFound({ message: 'Order not found' })

    const user = auth.user!
    const isConsumer = order.subscription.userId === user.id
    const cookProfile = await user.related('cookProfile').query().first()
    const isCook = cookProfile && order.subscription.mealPlan.cookId === cookProfile.id

    if (!isConsumer && !isCook) {
        return response.forbidden({ message: 'You are not authorized to view notes for this order' })
    }

    const notes = await OrderNote.query().where('orderId', orderId).preload('user').orderBy('createdAt', 'asc')
    return response.ok(notes)
  }
}
