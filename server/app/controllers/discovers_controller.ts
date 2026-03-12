import type { HttpContext } from '@adonisjs/core/http'
import CookProfile from '#models/cook_profile'

export default class DiscoversController {

    /**
     * List all cooks (for map pins and discovery tiles)
     */
    async index({ request, response }: HttpContext) {
        const { q, lat, lng, radius } = request.qs()

        const query = CookProfile.query()
            .preload('user')
            .select('*')

        if (q) {
            // We join with users to search by cook's name
            query.whereHas('user', (userQuery) => {
                userQuery.whereILike('name', `%${q}%`)
            }).orWhereILike('kitchenName', `%${q}%`)
        }

        // Basic Geo-filtering (Bounding Box MVP)
        if (lat && lng) {
            const r = parseFloat(radius || '10')
            const latitude = parseFloat(lat)
            const longitude = parseFloat(lng)

            // 1 degree ~ 111km
            const latDelta = r / 111
            const lngDelta = r / (111 * Math.cos(latitude * Math.PI / 180))

            query.whereBetween('latitude', [
                (latitude - latDelta).toString(), 
                (latitude + latDelta).toString()
            ])
            .whereBetween('longitude', [
                (longitude - lngDelta).toString(), 
                (longitude + lngDelta).toString()
            ])
        }

        const cooks = await query
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