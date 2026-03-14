import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  name: vine.string(),
  email: email().unique({ table: 'users', column: 'email' }),
  phone: vine.string().unique({ table: 'users', column: 'phone' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
  role: vine.enum(['consumer', 'cook']).nullable(),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})
