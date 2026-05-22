import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import {
  deactivateAccountValidator,
  updatePasswordValidator,
  updateProfileValidator,
} from '#validators/profile'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role === 'cook') {
      await user.load('cookProfile' as any)
    }

    return serialize(UserTransformer.transform(user))
  }

  async update({ auth, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateProfileValidator)

    if (payload.name !== undefined) {
      user.name = payload.name.trim()
    }

    if (payload.phone !== undefined) {
      const phone = payload.phone.trim()
      if (!phone) {
        user.phone = null
      } else {
        const taken = await User.query().where('phone', phone).whereNot('id', user.id).first()
        if (taken) {
          return response.conflict({ message: 'That phone number is already in use.' })
        }
        user.phone = phone
      }
    }

    await user.save()

    if (user.role === 'cook') {
      await user.load('cookProfile' as any)
    }

    return serialize(UserTransformer.transform(user))
  }

  async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updatePasswordValidator)

    const valid = await hash.verify(user.password, payload.currentPassword)
    if (!valid) {
      return response.badRequest({ message: 'Current password is incorrect.' })
    }

    user.password = payload.newPassword
    await user.save()

    await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

    return response.ok({ message: 'Password updated. Please sign in again on this device.' })
  }

  async deactivate({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(deactivateAccountValidator)

    const valid = await hash.verify(user.password, payload.password)
    if (!valid) {
      return response.badRequest({ message: 'Password is incorrect.' })
    }

    user.isActive = false
    await user.save()
    await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

    return response.ok({ message: 'Account deactivated. You have been signed out everywhere.' })
  }
}
