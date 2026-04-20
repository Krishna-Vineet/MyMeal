import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import { beforeCreate, beforeSave, hasOne, hasMany, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import CookProfile from '#models/cook_profile'
import Subscription from '#models/subscription'
import Payment from '#models/payment'
import Review from '#models/review'

/**
 * 🎓 ADONIS VS MONGOOSE LEARNING NOTE:
 * In Express + Mongoose, you would define your schema and model in one place:
 * const UserSchema = new mongoose.Schema({ name: String })
 * const User = mongoose.model('User', UserSchema)
 * 
 * In AdonisJS, the table columns are automatically generated in `#database/schema` 
 * based on your Postgres migrations. Here in the Model file, we just define 
 * the custom methods and **relationships**.
 */
export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column()
  declare phone: string | null

  @beforeCreate()
  static async assignUuid(user: User) {
    user.id = randomUUID()
  }

  @beforeSave()
  static async autoHashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  /**
   * 🎓 Relationships in AdonisJS
   * Instead of Mongoose's `.populate('cookProfile')` which uses ObjectId refs, 
   * AdonisJS uses relational sql Foreign Keys. 
   * A User has one CookProfile. The CookProfile table has a `user_id` column.
   */
  @hasOne(() => CookProfile)
  declare cookProfile: HasOne<typeof CookProfile>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>

}
