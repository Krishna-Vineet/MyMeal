import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('user_id').notNullable().references('users.id')

      table.uuid('subscription_id').notNullable().references('subscriptions.id')

      table.integer('amount')

      table
        .enum('method', ['upi', 'card', 'cash'])

      table
        .enum('status', ['pending', 'success', 'failed'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}