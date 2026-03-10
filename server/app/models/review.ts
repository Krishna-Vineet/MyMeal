import { ReviewSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import CookProfile from '#models/cook_profile'

export default class Review extends ReviewSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => CookProfile)
  declare cookProfile: BelongsTo<typeof CookProfile>
}