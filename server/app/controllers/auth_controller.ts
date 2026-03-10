import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { signupValidator, loginValidator } from '#validators/user'
import UserTransformer from '#transformers/user_transformer'

export default class AuthController {
  
  /**
   * User Registration Flow
   */
  async register({ request, response, serialize }: HttpContext) {
    // 1 & 2. Receive request body & Validate required fields (VineJS also checks if email exists!)
    const payload = await request.validateUsing(signupValidator)

    // 3. Hash password using Adonis hashing service
    const hashedPassword = await hash.make(payload.password)

    // 4. Create user
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role || 'consumer', // default role
    })

    // 5. Create access token
    const token = await User.accessTokens.create(user)

    // 6. Return token + user (using Transformer to hide password/internal fields)
    return response.created(serialize({
      message: 'Registration successful',
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    }))
  }

  /**
   * User Login Flow
   */
  async login({ request, serialize }: HttpContext) {
    // Validate email and password presence
    const { email, password } = await request.validateUsing(loginValidator)

    // Find user by email and verify password hash
    // (Adonis handles the hash comparison under the hood with verifyCredentials)
    const user = await User.verifyCredentials(email, password)

    // Create a new token for the session
    const token = await User.accessTokens.create(user)

    // Return the token and user data
    return serialize({
      message: 'Login successful',
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
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