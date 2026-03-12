import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meal_plans'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('available_durations').notNullable().defaultTo(JSON.stringify(['1_week', '1_month']))
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (_table) => {
    })
  }
}