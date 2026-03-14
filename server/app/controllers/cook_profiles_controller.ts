import type { HttpContext } from '@adonisjs/core/http'
import CookProfile from '#models/cook_profile'
import { createCookProfileValidator, updateCookProfileValidator } from '#validators/cook_profile'
import CloudinaryService from '#services/cloudinary_service'

const cloudinary = new CloudinaryService()

export default class CookProfilesController {

    /**
     * Create a new cook profile
     */
    async store({ request, auth, response }: HttpContext) {
        const user = auth.user!

        const existingProfile = await CookProfile.findBy('userId', user.id)
        if (existingProfile) {
            return response.badRequest({ message: 'A cook profile already exists for this user.' })
        }

        const payload = await request.validateUsing(createCookProfileValidator)

        // Handle Image Uploads
        if (payload.kitchenImage) {
            payload.kitchenImage = await cloudinary.uploadImage(payload.kitchenImage)
        }
        if (payload.bannerImage) {
            payload.bannerImage = await cloudinary.uploadImage(payload.bannerImage)
        }

        const profile = await user.related('cookProfile').create(payload)

        return response.created({
            message: 'Cook profile created successfully',
            profile
        })
    }

    /**
     * Update an existing cook profile
     */
    async update({ request, auth, response }: HttpContext) {
        const user = auth.user!

        const profile = await CookProfile.findBy('userId', user.id)
        if (!profile) {
            return response.notFound({ message: 'Cook profile not found. Please create one first.' })
        }

        const payload = await request.validateUsing(updateCookProfileValidator)

        // Handle Image Uploads
        if (payload.kitchenImage) {
            payload.kitchenImage = await cloudinary.uploadImage(payload.kitchenImage)
        }
        if (payload.bannerImage) {
            payload.bannerImage = await cloudinary.uploadImage(payload.bannerImage)
        }

        profile.merge(payload)
        await profile.save()

        return response.ok({
            message: 'Cook profile updated successfully',
            profile
        })
    }
}