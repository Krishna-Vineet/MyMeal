import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('user_id').notNullable().references('users.id')

      table.uuid('meal_plan_id').notNullable().references('meal_plans.id')

      table.uuid('pickup_slot_id').notNullable().references('pickup_slots.id')

      table.date('start_date')

      table.date('end_date')

      table
        .enum('status', ['active', 'paused', 'cancelled', 'completed'])
        .defaultTo('active')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}