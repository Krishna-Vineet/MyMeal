import vine from '@vinejs/vine'

/**
 * Validator for creating a new review.
 */
export const createReviewValidator = vine.compile(
  vine.object({
    cookId: vine.string().trim(),
    rating: vine.number().min(1).max(5),
    comment: vine.string().trim().maxLength(1000).optional(),
  })
)
