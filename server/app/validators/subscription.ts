import vine from '@vinejs/vine'

/**
 * Validator for creating a new subscription.
 * Note: startDate and endDate are strings because the frontend sends them as ISO/Date strings,
 * and we parse them using Luxon in the controller.
 */
export const createSubscriptionValidator = vine.compile(
    vine.object({
        mealPlanId: vine.string().trim(),
        pickupSlotId: vine.string().trim(),
        startDate: vine.string().trim(),
        endDate: vine.string().trim().optional(),
        
        components: vine.array(
            vine.object({
                mealComponentId: vine.string().trim(),
                quantity: vine.number().min(0),
                enabled: vine.boolean().optional()
            })
        ).minLength(1)
    })
)

/**
 * Validator for updating a subscription status (e.g., active, cancelled, paused)
 */
export const updateSubscriptionStatusValidator = vine.compile(
    vine.object({
        status: vine.enum(['active', 'cancelled', 'paused'])
    })
)
