import type { HttpContext } from '@adonisjs/core/http'
import MealPlan from '#models/meal_plan'
import CookProfile from '#models/cook_profile'
import { createMealPlanValidator, updateMealPlanValidator } from '#validators/meal_plan'
import db from '@adonisjs/lucid/services/db'

export default class MealPlansController {

    /**
     * List all meal plans for the logged in cook
     */
    async index({ auth, response }: HttpContext) {
        const user = auth.user!

        const cookProfile = await CookProfile.findBy('userId', user.id)
        if (!cookProfile) return response.notFound({ message: 'Cook profile not found' })

        const mealPlans = await MealPlan.query()
            .where('cookId', cookProfile.id)
            .preload('mealComponents')
            .preload('pickupSlots')

        return response.ok(mealPlans)
    }

    /**
     * Transactionally create a new meal plan with its components and pickup slots
     */
    async store({ request, auth, response }: HttpContext) {
        const user = auth.user!

        const cookProfile = await CookProfile.findBy('userId', user.id)
        if (!cookProfile) return response.forbidden({ message: 'You must create a cook profile first.' })

        const payload = await request.validateUsing(createMealPlanValidator)

        // Start transaction to ensure everything saves together, or nothing saves
        const trx = await db.transaction()

        try {
            // 1. Create Meal Plan
            const mealPlan = new MealPlan()
            mealPlan.title = payload.title
            mealPlan.description = payload.description || null
            mealPlan.basePrice = payload.basePrice
            mealPlan.subscriberLimit = payload.subscriberLimit || null
            mealPlan.bannerImage = payload.bannerImage || null
            mealPlan.isActive = payload.isActive ?? true
            mealPlan.cookId = cookProfile.id

            mealPlan.useTransaction(trx)
            await mealPlan.save()

            // 2. Create Components
            await mealPlan.related('mealComponents').createMany(payload.components)

            // 3. Create Pickup Slots
            await mealPlan.related('pickupSlots').createMany(payload.pickupSlots)

            await trx.commit()

            // Load relationships to return the full object back to frontend
            await mealPlan.load('mealComponents')
            await mealPlan.load('pickupSlots')

            return response.created({
                message: 'Meal plan created successfully',
                mealPlan
            })

        } catch (error) {
            await trx.rollback()
            // Log the actual error to server console, return generic to user
            console.error('Failed to create meal plan transactionally:', error)
            return response.internalServerError({ message: 'Failed to create meal plan', error: (error as Error).message })
        }
    }

    /**
     * Update a meal plan (Basic details. Full sub-array update is complex, 
     * so we will just update base values for now, a full replacement would recreate the arrays)
     */
    async update({ params, request, auth, response }: HttpContext) {
        const user = auth.user!
        const cookProfile = await CookProfile.findBy('userId', user.id)
        if (!cookProfile) return response.forbidden({ message: 'Cook profile not found' })

        const mealPlan = await MealPlan.query()
            .where('id', params.id)
            .where('cookId', cookProfile.id)
            .first()

        if (!mealPlan) return response.notFound({ message: 'Meal plan not found' })

        const payload = await request.validateUsing(updateMealPlanValidator)

        // For now we only support updating the top-level plan properties.
        // Updating nested arrays via PATCH is complex and usually requires deleting old/inserting new
        // We will leave the nested arrays out of the payload merge for this simple phase
        const mergedPayload = { ...payload }
        delete mergedPayload.components
        delete mergedPayload.pickupSlots

        mealPlan.merge(mergedPayload)
        await mealPlan.save()

        return response.ok({ message: 'Meal plan updated successfully', mealPlan })
    }
}