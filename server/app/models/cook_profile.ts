import { CookProfileSchema } from '#database/schema'
import { belongsTo, hasMany, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import MealPlan from '#models/meal_plan'
import PickupSlot from '#models/pickup_slot'
import Review from '#models/review'

/**
 * 🎓 ADONIS VS EXPRESS/MONGOOSE:
 * In Express with MongoDB (NoSQL), you embed documents or reference ObjectId instances.
 * But since we are using PostgreSQL (a Relational DB), tables are strongly linked 
 * through "Foreign Keys" (e.g., user_id inside cook_profiles table).
 * 
 * Notice how clean this is? The properties (kitchenName, bio) are already inherited
 * from CookProfileSchema, meaning you get fully typed autocomplete (TypeScript magic)!
 */
export default class CookProfile extends CookProfileSchema {
  @column()
  declare kitchenImage: string | null

  @column()
  declare bannerImage: string | null

  @column()
  declare wallet: string
  
  /**
   * belongsTo establishes the inverse of hasOne.
   * CookProfile belongs to a User.
   */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => MealPlan)
  declare mealPlans: HasMany<typeof MealPlan>

  @hasMany(() => PickupSlot)
  declare pickupSlots: HasMany<typeof PickupSlot>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>
}