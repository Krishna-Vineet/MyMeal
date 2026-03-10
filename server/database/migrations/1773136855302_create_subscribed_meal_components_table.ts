import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscribed_meal_components'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('subscription_id')
        .notNullable()
        .references('subscriptions.id')
        .onDelete('CASCADE')

      table.index(['subscription_id'])

      table
        .uuid('meal_component_id')
        .notNullable()
        .references('meal_components.id')

      table.integer('quantity').nullable()
      table.boolean('enabled').defaultTo(true)
      table.integer('price')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}