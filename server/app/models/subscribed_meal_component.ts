import { SubscribedMealComponentSchema } from '#database/schema'
import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import Subscription from '#models/subscription'
import MealComponent from '#models/meal_component'

export default class SubscribedMealComponent extends SubscribedMealComponentSchema {
  @beforeCreate()
  static async assignUuid(component: SubscribedMealComponent) {
    component.id = randomUUID()
  }

  @belongsTo(() => Subscription)
  declare subscription: BelongsTo<typeof Subscription>

  @belongsTo(() => MealComponent)
  declare mealComponent: BelongsTo<typeof MealComponent>
}