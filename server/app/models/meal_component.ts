import { MealComponentSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import MealPlan from '#models/meal_plan'
import SubscribedMealComponent from '#models/subscribed_meal_component'

export default class MealComponent extends MealComponentSchema {
  @belongsTo(() => MealPlan)
  declare mealPlan: BelongsTo<typeof MealPlan>

  @hasMany(() => SubscribedMealComponent)
  declare subscribedMealComponents: HasMany<typeof SubscribedMealComponent>
}