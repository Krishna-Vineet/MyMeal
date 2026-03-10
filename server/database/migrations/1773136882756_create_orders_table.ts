import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('subscription_id')
        .notNullable()
        .references('subscriptions.id')

      table.date('order_date')

      table.integer('price')

      table
        .enum('status', [
          'scheduled',
          'prepared',
          'picked_up',
          'missed',
          'cancelled'
        ])
        .defaultTo('scheduled')

      table.integer('total_price')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}