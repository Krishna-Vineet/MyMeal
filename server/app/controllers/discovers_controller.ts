import type { HttpContext } from '@adonisjs/core/http'
import CookProfile from '#models/cook_profile'

export default class DiscoversController {

    /**
     * List all cooks (for map pins and discovery tiles)
     */
    async index({ response }: HttpContext) {
        const cooks = await CookProfile.query()
            .select('id', 'kitchen_name', 'bio', 'latitude', 'longitude', 'image', 'city', 'address')

        return response.ok(cooks)
    }

    /**
     * Show a specific cook profile with all their meal plans, components and slots
     */
    async show({ params, response }: HttpContext) {
        const cook = await CookProfile.query()
            .where('id', params.id)
            .preload('mealPlans', (planQuery) => {
                planQuery.where('isActive', true)
                planQuery.preload('mealComponents')
                planQuery.preload('pickupSlots')
            })
            .first()

        if (!cook) {
            return response.notFound({ message: 'Cook not found' })
        }

        return response.ok(cook)
    }
}