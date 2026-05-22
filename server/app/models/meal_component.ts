import { MealComponentSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import MealPlan from '#models/meal_plan'
import SubscribedMealComponent from '#models/subscribed_meal_component'

export default class MealComponent extends MealComponentSchema {
  @beforeCreate()
  static async assignUuid(component: MealComponent) {
    component.id = randomUUID()
  }
  @belongsTo(() => MealPlan)
  declare mealPlan: BelongsTo<typeof MealPlan>

  @hasMany(() => SubscribedMealComponent)
  declare subscribedMealComponents: HasMany<typeof SubscribedMealComponent>
}