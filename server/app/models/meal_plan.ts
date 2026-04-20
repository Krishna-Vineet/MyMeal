import { MealPlanSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import CookProfile from '#models/cook_profile'
import MealComponent from '#models/meal_component'
import Subscription from '#models/subscription'
import PickupSlot from '#models/pickup_slot'

export default class MealPlan extends MealPlanSchema {
  @belongsTo(() => CookProfile)
  declare cook: BelongsTo<typeof CookProfile>

  @beforeCreate()
  static async assignUuid(plan: MealPlan) {
    plan.id = randomUUID()
  }

  @hasMany(() => MealComponent)
  declare mealComponents: HasMany<typeof MealComponent>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>
  
  @hasMany(() => PickupSlot)
  declare pickupSlots: HasMany<typeof PickupSlot>
}