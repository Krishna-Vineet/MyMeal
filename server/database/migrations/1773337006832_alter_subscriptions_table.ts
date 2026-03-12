import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('duration', ['one_time', '1_week', '2_week', '1_month', '3_month']).notNullable().defaultTo('1_month')
      table.decimal('total_price', 12, 2).notNullable().defaultTo(0)
      table.decimal('amount_paid', 12, 2).notNullable().defaultTo(0)
      table.decimal('amount_consumed', 12, 2).notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (_table) => {
    })
  }
}