import vine from '@vinejs/vine'

export const createMealPlanValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3),
        description: vine.string().trim().optional(),
        basePrice: vine.number().min(0),
        subscriberLimit: vine.number().min(1).optional(),
        bannerImage: vine.string().trim().optional(),
        isActive: vine.boolean().optional(),

        components: vine.array(
            vine.object({
                name: vine.string().trim().minLength(2),
                price: vine.number().min(0).optional(),
                defaultQuantity: vine.number().min(0).optional(),
                maxQuantity: vine.number().min(1).optional(),
                isToggle: vine.boolean().optional()
            })
        ).minLength(1),

        pickupSlots: vine.array(
            vine.object({
                locationName: vine.string().trim().minLength(2),
                address: vine.string().trim().optional(),
                latitude: vine.string().trim().optional(),
                longitude: vine.string().trim().optional(),
                pickupTime: vine.string().trim()
            })
        ).minLength(1)
    })
)

export const updateMealPlanValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).optional(),
        description: vine.string().trim().optional(),
        basePrice: vine.number().min(0).optional(),
        subscriberLimit: vine.number().min(1).optional(),
        bannerImage: vine.string().trim().optional(),
        isActive: vine.boolean().optional(),

        // For MVP, we allow optional array replacement for components/slots in PATCH
        components: vine.array(
            vine.object({
                name: vine.string().trim().minLength(2),
                price: vine.number().min(0).optional(),
                defaultQuantity: vine.number().min(0).optional(),
                maxQuantity: vine.number().min(1).optional(),
                isToggle: vine.boolean().optional()
            })
        ).optional(),

        pickupSlots: vine.array(
            vine.object({
                locationName: vine.string().trim().minLength(2),
                address: vine.string().trim().optional(),
                latitude: vine.string().trim().optional(),
                longitude: vine.string().trim().optional(),
                pickupTime: vine.string().trim()
            })
        ).optional()
    })
)