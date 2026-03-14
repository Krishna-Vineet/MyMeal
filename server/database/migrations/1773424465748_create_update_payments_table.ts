import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('type', ['advance', 'topup', 'settlement', 'refund', 'payout']).notNullable().defaultTo('advance')
      table.uuid('order_id').references('orders.id').onDelete('SET NULL').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type')
      table.dropColumn('order_id')
    })
  }
}