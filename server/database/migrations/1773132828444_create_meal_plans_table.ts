import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meal_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('cook_id')
        .notNullable()
        .references('cook_profiles.id')
        .onDelete('CASCADE')

      table.string('title').notNullable()

      table.text('description')

      table.string('banner_image')

      table.integer('base_price').notNullable()

      table.integer('subscriber_limit').defaultTo(10)

      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}