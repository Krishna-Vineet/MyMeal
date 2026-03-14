import type { HttpContext } from '@adonisjs/core/http'
import Review from '#models/review'
import CookProfile from '#models/cook_profile'
import { createReviewValidator } from '#validators/review'

export default class ReviewsController {
  /**
   * Submit a review for a cook
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createReviewValidator)

    // Check if cook exists
    const cook = await CookProfile.find(payload.cookId)
    if (!cook) {
      return response.notFound({ message: 'Cook not found' })
    }

    // Consumers cannot review themselves if they are also a cook (unlikely but safe check)
    if (cook.userId === user.id) {
        return response.forbidden({ message: 'You cannot review your own kitchen' })
    }

    // Only one review per user per cook for now (can be per order in future)
    const existing = await Review.query()
        .where('userId', user.id)
        .where('cookId', payload.cookId)
        .first()
    
    if (existing) {
        return response.badRequest({ message: 'You have already reviewed this cook' })
    }

    const review = await Review.create({
      userId: user.id,
      cookId: payload.cookId,
      rating: payload.rating,
      comment: payload.comment
    })

    return response.created(review)
  }

  /**
   * List reviews for a specific cook
   */
  async index({ params, response }: HttpContext) {
    const cookId = params.id
    const reviews = await Review.query()
      .where('cookId', cookId)
      .preload('user', (uq) => uq.select('id', 'name'))
      .orderBy('createdAt', 'desc')

    return response.ok(reviews)
  }
}
