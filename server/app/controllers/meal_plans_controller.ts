import type { HttpContext } from '@adonisjs/core/http'
import MealPlan from '#models/meal_plan'
import CookProfile from '#models/cook_profile'
import { createMealPlanValidator, updateMealPlanValidator } from '#validators/meal_plan'
import db from '@adonisjs/lucid/services/db'
import CloudinaryService from '#services/cloudinary_service'

const cloudinary = new CloudinaryService()

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

        let payload = request.all()
        
        // 🎓 FORMDATA CAVEAT: 
        // When sending complex data via FormData, everything is stringified.
        
        // 1. Parse JSON strings back to arrays
        const jsonFields = ['components', 'pickupSlots', 'availableDurations']
        jsonFields.forEach(field => {
            if (typeof payload[field] === 'string' && (payload[field].startsWith('[') || payload[field].startsWith('{'))) {
                try { payload[field] = JSON.parse(payload[field]) } catch (e) {}
            }
        })

        // 2. Convert "true"/"false" strings to actual booleans
        if (payload.isActive === 'true') payload.isActive = true
        if (payload.isActive === 'false') payload.isActive = false

        // 3. Convert numeric strings to actual numbers
        if (payload.basePrice !== undefined && typeof payload.basePrice === 'string') {
            payload.basePrice = Number(payload.basePrice)
        }
        if (payload.subscriberLimit !== undefined && typeof payload.subscriberLimit === 'string') {
            payload.subscriberLimit = Number(payload.subscriberLimit)
        }

        payload = await request.validateUsing(createMealPlanValidator, { data: payload })

        // Start transaction to ensure everything saves together, or nothing saves
        const trx = await db.transaction()

        try {
            // 1. Create Meal Plan
            const mealPlan = new MealPlan()
            mealPlan.title = payload.title
            mealPlan.description = payload.description || null
            mealPlan.basePrice = payload.basePrice
            mealPlan.subscriberLimit = payload.subscriberLimit || null
            
            // Banner: keep https URLs; otherwise upload (base64 / data URI) via Cloudinary
            const bannerFile = request.file('bannerFile', {
                size: '25mb',
                extnames: ['jpg', 'png', 'jpeg', 'webp'],
            })

            if (bannerFile) {
                mealPlan.bannerImage = await cloudinary.uploadFile(bannerFile)
            } else if (payload.bannerImage) {
                const raw = payload.bannerImage.trim()
                // Always ensure it's in our Cloudinary storage for resizing/consistency
                mealPlan.bannerImage = await cloudinary.uploadImage(raw)
            } else {
                mealPlan.bannerImage = null
            }

            mealPlan.isActive = payload.isActive ?? true
            mealPlan.validityType = payload.validityType || 'all_days'
            mealPlan.availableDurations = payload.availableDurations || ['1_week', '1_month']
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
            console.error('Failed to create meal plan transactionally:', error)
            return response.internalServerError({ message: 'Failed to create meal plan', error: (error as Error).message })
        }
    }

    /**
     * Update a meal plan
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

        let payload = request.all()
        
        // Handle FormData stringification
        if (payload.isActive === 'true') payload.isActive = true
        if (payload.isActive === 'false') payload.isActive = false
        if (payload.basePrice !== undefined && typeof payload.basePrice === 'string') {
            payload.basePrice = Number(payload.basePrice)
        }
        if (payload.subscriberLimit !== undefined && typeof payload.subscriberLimit === 'string') {
            payload.subscriberLimit = Number(payload.subscriberLimit)
        }

        payload = await request.validateUsing(updateMealPlanValidator, { data: payload })

        const mergedPayload = { ...payload }
        delete mergedPayload.components
        delete mergedPayload.pickupSlots

        // Banner file upload support in update
        const bannerFile = request.file('bannerFile', {
            size: '25mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })

        if (bannerFile) {
            mergedPayload.bannerImage = await cloudinary.uploadFile(bannerFile)
        } else if (mergedPayload.bannerImage) {
            const raw = mergedPayload.bannerImage.trim()
            mergedPayload.bannerImage = await cloudinary.uploadImage(raw)
        }

        mealPlan.merge(mergedPayload)
        await mealPlan.save()

        return response.ok({ message: 'Meal plan updated successfully', mealPlan })
    }

    /**
     * Delete a meal plan
     */
    async destroy({ params, auth, response }: HttpContext) {
        const user = auth.user!
        const cookProfile = await CookProfile.findBy('userId', user.id)
        if (!cookProfile) return response.forbidden({ message: 'Cook profile not found' })

        const mealPlan = await MealPlan.query()
            .where('id', params.id)
            .where('cookId', cookProfile.id)
            .first()

        if (!mealPlan) return response.notFound({ message: 'Meal plan not found' })

        await mealPlan.delete()
        return response.ok({ message: 'Meal plan deleted' })
    }
}