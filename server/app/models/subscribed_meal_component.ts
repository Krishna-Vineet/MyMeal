import { SubscribedMealComponentSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Subscription from '#models/subscription'
import MealComponent from '#models/meal_component'

export default class SubscribedMealComponent extends SubscribedMealComponentSchema {
  @belongsTo(() => Subscription)
  declare subscription: BelongsTo<typeof Subscription>

  @belongsTo(() => MealComponent)
  declare mealComponent: BelongsTo<typeof MealComponent>
}