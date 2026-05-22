import { MealPlanSchema } from '#database/schema'
import { beforeCreate, beforeSave, afterFind, afterFetch, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import CookProfile from '#models/cook_profile'
import MealComponent from '#models/meal_component'
import Subscription from '#models/subscription'
import PickupSlot from '#models/pickup_slot'

function parseDurations(value: unknown): string[] {
  if (value == null) {
    return ['1_week', '1_month']
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      return Array.isArray(parsed) ? (parsed as string[]) : ['1_week', '1_month']
    } catch {
      return ['1_week', '1_month']
    }
  }
  if (Array.isArray(value)) {
    return value as string[]
  }
  return ['1_week', '1_month']
}

export default class MealPlan extends MealPlanSchema {
  @belongsTo(() => CookProfile, { foreignKey: 'cookId' })
  declare cook: BelongsTo<typeof CookProfile>

  @beforeCreate()
  static async assignUuid(plan: MealPlan) {
    plan.id = randomUUID()
  }

  @beforeSave()
  static stringifyAvailableDurations(plan: MealPlan) {
    const v = plan.availableDurations as unknown
    if (typeof v === 'string') {
      return
    }
    if (Array.isArray(v)) {
      plan.availableDurations = JSON.stringify(v) as unknown as typeof plan.availableDurations
    }
  }

  @afterFind()
  static parseAvailableDurationsAfterFind(plan: MealPlan) {
    plan.availableDurations = parseDurations(plan.availableDurations) as any
  }

  @afterFetch()
  static parseAvailableDurationsAfterFetch(plans: MealPlan[]) {
    for (const plan of plans) {
      plan.availableDurations = parseDurations(plan.availableDurations) as any
    }
  }

  @hasMany(() => MealComponent)
  declare mealComponents: HasMany<typeof MealComponent>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>

  @hasMany(() => PickupSlot)
  declare pickupSlots: HasMany<typeof PickupSlot>
}
