import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { signupValidator, loginValidator } from '#validators/user'

export default class AuthController {
  
  /**
   * User Registration Flow
   */
  async register({ request, response }: HttpContext) {
    // 1 & 2. Receive request body & Validate required fields (VineJS also checks if email exists!)
    const payload = await request.validateUsing(signupValidator)

    // 4. Create user (Hashing is handled by User model hook now)
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: payload.role || "consumer",
    })

    // 5. Create access token
    const token = await User.accessTokens.create(user)

    // 6. Return token + user
    return response.created({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: token.value!.release(),
    })
  }

  /**
   * User Login Flow
   */
  async login({ request }: HttpContext) {
    // Validate email and password presence
    const { email, password } = await request.validateUsing(loginValidator)

    // Find user by email and verify password hash
    // (Adonis handles the hash comparison under the hood with verifyCredentials)
    const user = await User.verifyCredentials(email, password)

    // Create a new token for the session
    const token = await User.accessTokens.create(user)

    // Return the token and user data
    return {
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: token.value!.release(),
    }
  }

  /**
   * User Logout Flow (Protected Route)
   */
  async logout({ auth, response }: HttpContext) {
    // auth.user is guaranteed to exist because this route will be protected by middleware.auth()
    const user = auth.user!

    // Revoke the current access token
    await User.accessTokens.delete(user, user.currentAccessToken!.identifier)

    return response.ok({ message: 'Logged out successfully' })
  }
}