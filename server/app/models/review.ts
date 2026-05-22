import { ReviewSchema } from '#database/schema'
import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import User from '#models/user'
import CookProfile from '#models/cook_profile'

export default class Review extends ReviewSchema {
  @beforeCreate()
  static async assignUuid(review: Review) {
    review.id = randomUUID()
  }
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => CookProfile, { foreignKey: 'cookId' })
  declare cookProfile: BelongsTo<typeof CookProfile>
}