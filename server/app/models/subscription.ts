import { SubscriptionSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import MealPlan from '#models/meal_plan'
import PickupSlot from '#models/pickup_slot'
import SubscribedMealComponent from '#models/subscribed_meal_component'
import Order from '#models/order'
import Payment from '#models/payment'

export default class Subscription extends SubscriptionSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static async assignUuid(sub: Subscription) {
    sub.id = randomUUID()
  }

  @belongsTo(() => MealPlan)
  declare mealPlan: BelongsTo<typeof MealPlan>

  @belongsTo(() => PickupSlot)
  declare pickupSlot: BelongsTo<typeof PickupSlot>

  @hasMany(() => SubscribedMealComponent)
  declare subscribedMealComponents: HasMany<typeof SubscribedMealComponent>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>
}