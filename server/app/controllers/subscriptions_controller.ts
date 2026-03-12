import type { HttpContext } from '@adonisjs/core/http'
import Subscription from '#models/subscription'
import MealPlan from '#models/meal_plan'
import MealComponent from '#models/meal_component'
import db from '@adonisjs/lucid/services/db'
import { createSubscriptionValidator } from '#validators/subscription'
import { DateTime } from 'luxon'

export default class SubscriptionsController {

    /**
     * Subscribe a consumer to a meal plan
     */
    async store({ request, auth, response }: HttpContext) {
        const user = auth.user!
        const payload = await request.validateUsing(createSubscriptionValidator)

        // 1. Validate Meal Plan exists and is active
        const mealPlan = await MealPlan.query()
            .where('id', payload.mealPlanId)
            .where('isActive', true)
            .first()

        if (!mealPlan) {
            return response.notFound({ message: 'Active meal plan not found' })
        }

        // 2. Validate Pickup Slot belongs to the meal plan
        const slot = await mealPlan.related('pickupSlots').query()
            .where('id', payload.pickupSlotId)
            .first()
        
        if (!slot) {
            return response.badRequest({ message: 'The selected pickup slot does not belong to this meal plan' })
        }

        // 3. Start Transaction
        const trx = await db.transaction()

        try {
            // Create the main subscription record
            const subscription = new Subscription()
            subscription.userId = user.id
            subscription.mealPlanId = payload.mealPlanId
            subscription.pickupSlotId = payload.pickupSlotId
            subscription.startDate = DateTime.fromISO(payload.startDate)
            if (payload.endDate) {
                subscription.endDate = DateTime.fromISO(payload.endDate)
            }
            subscription.status = 'active'
            
            subscription.useTransaction(trx)
            await subscription.save()

            // 4. Create Subscribed Components (Snapshotting prices)
            const componentIds = payload.components.map(c => c.mealComponentId)
            const mealComponents = await MealComponent.query().whereIn('id', componentIds)

            const subComponentsData = payload.components.map(item => {
                const original = mealComponents.find(mc => mc.id === item.mealComponentId)
                if (!original) throw new Error(`Specific meal component ${item.mealComponentId} was not found`)

                return {
                    mealComponentId: item.mealComponentId,
                    quantity: item.quantity,
                    enabled: item.enabled ?? true,
                    price: original.price // THIS IS CRITICAL: Snapshots the price at time of subscription
                }
            })

            await subscription.related('subscribedMealComponents').createMany(subComponentsData)

            await trx.commit()

            // Return full subscription object back to frontend
            await subscription.load('subscribedMealComponents')
            await subscription.load('mealPlan')
            await subscription.load('pickupSlot')

            return response.created({
                message: 'Meal plan subscribed successfully!',
                subscription
            })

        } catch (error) {
            await trx.rollback()
            console.error('Subscription failed:', error)
            return response.internalServerError({ 
                message: 'Failed to create subscription', 
                error: (error as Error).message 
            })
        }
    }

    /**
     * List current user's subscriptions
     */
    async index({ auth, response }: HttpContext) {
        const user = auth.user!
        const subscriptions = await Subscription.query()
            .where('userId', user.id)
            .preload('mealPlan', (q) => q.preload('cook'))
            .preload('pickupSlot')
            .preload('subscribedMealComponents', (q) => q.preload('mealComponent'))
            .orderBy('createdAt', 'desc')

        return response.ok(subscriptions)
    }

    /**
     * Cancel a subscription
     */
    async destroy({ params, auth, response }: HttpContext) {
        const user = auth.user!
        const subscription = await Subscription.query()
            .where('id', params.id)
            .where('userId', user.id)
            .first()

        if (!subscription) return response.notFound({ message: 'Subscription not found' })

        subscription.status = 'cancelled'
        await subscription.save()

        return response.ok({ message: 'Subscription cancelled successfully' })
    }
}