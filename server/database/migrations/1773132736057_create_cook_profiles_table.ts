import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cook_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('user_id')
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE')

      table.string('kitchen_name')

      table.text('bio')

      table.string('phone')

      table.string('address')

      table.string('city')

      table.decimal('latitude', 10, 8)

      table.decimal('longitude', 11, 8)

      table.string('image')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}