import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    
    // If the user is a cook, preload their cook profile details
    if (user.role === 'cook') {
      await user.load('cookProfile' as any)
    }
    
    return serialize(UserTransformer.transform(user))
  }

}
