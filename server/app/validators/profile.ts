import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(120).optional(),
    /** Empty string clears phone on the server */
    phone: vine.string().maxLength(32).optional(),
  })
)

export const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(1),
    newPassword: vine.string().minLength(8).maxLength(32),
    newPasswordConfirmation: vine.string().sameAs('newPassword'),
  })
)

export const deactivateAccountValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(1),
  })
)
