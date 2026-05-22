import { BaseModel, beforeCreate, beforeSave, hasOne, hasMany, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { randomUUID } from 'node:crypto'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import CookProfile from '#models/cook_profile'
import Subscription from '#models/subscription'
import Payment from '#models/payment'
import Review from '#models/review'

/**
 * 🎓 ADONIS VS MONGOOSE LEARNING NOTE:
 * In Express + Mongoose, you would define your schema and model in one place.
 * In AdonisJS, we define the table columns with @column decorators.
 */
export default class User extends compose(BaseModel, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: string

  @column()
  declare phone: string | null

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async assignUuid(user: User) {
    if (!user.id) {
      user.id = randomUUID()
    }
  }

  @beforeSave()
  static async autoHashPassword(user: User) {
    if (user.$dirty.password && user.password) {
      // 🎓 Prevent double hashing if password already starts with hash prefix
      if (!user.password.startsWith('$scrypt$')) {
        user.password = await hash.make(user.password)
      }
    }
  }

  @hasOne(() => CookProfile)
  declare cookProfile: HasOne<typeof CookProfile>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>
}


