import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meal_plans'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('validity_type', ['weekdays', 'weekends', 'all_days']).notNullable().defaultTo('all_days')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('validity_type')
    })
  }
}