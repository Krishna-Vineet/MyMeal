import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,
      role: this.resource.role,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
      cookProfile: this.resource.$preloaded.cookProfile ? this.resource.cookProfile : undefined,
    }
  }
}
