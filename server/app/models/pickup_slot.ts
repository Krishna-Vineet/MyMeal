import { PickupSlotSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import MealPlan from '#models/meal_plan'
import Subscription from '#models/subscription'

export default class PickupSlot extends PickupSlotSchema {
  @beforeCreate()
  static async assignUuid(slot: PickupSlot) {
    slot.id = randomUUID()
  }
  @belongsTo(() => MealPlan)
  declare mealPlan: BelongsTo<typeof MealPlan>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>
}