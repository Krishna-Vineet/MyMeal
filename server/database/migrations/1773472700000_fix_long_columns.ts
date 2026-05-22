import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meal_plans'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('banner_image').alter()
    })
    this.schema.alterTable('cook_profiles', (table) => {
      table.text('banner_image').alter()
      table.text('kitchen_image').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('banner_image', 255).alter()
    })
    this.schema.alterTable('cook_profiles', (table) => {
      table.string('banner_image', 255).alter()
      table.string('kitchen_image', 255).alter()
    })
  }
}
