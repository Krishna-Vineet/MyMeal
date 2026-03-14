import vine from '@vinejs/vine'

export const createCookProfileValidator = vine.compile(
  vine.object({
    kitchenName: vine.string().trim().minLength(3),
    bio: vine.string().trim().optional(),
    kitchenImage: vine.string().trim().optional(),
    bannerImage: vine.string().trim().optional(),
    location: vine.string().trim().optional(),
    latitude: vine.string().trim().optional(),
    longitude: vine.string().trim().optional(),
  })
)

export const updateCookProfileValidator = vine.compile(
  vine.object({
    kitchenName: vine.string().trim().minLength(3).optional(),
    bio: vine.string().trim().optional(),
    kitchenImage: vine.string().trim().optional(),
    bannerImage: vine.string().trim().optional(),
    location: vine.string().trim().optional(),
    latitude: vine.string().trim().optional(),
    longitude: vine.string().trim().optional(),
  })
)