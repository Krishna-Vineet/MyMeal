import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meal_components'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('meal_plan_id')
        .notNullable()
        .references('meal_plans.id')
        .onDelete('CASCADE')

      table.string('name')

      table.integer('price')

      table.boolean('is_toggle').defaultTo(false)

      table.integer('default_quantity')

      table.integer('max_quantity')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}