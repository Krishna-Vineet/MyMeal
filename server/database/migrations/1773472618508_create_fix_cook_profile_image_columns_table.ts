import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cook_profiles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('image', 'kitchen_image')
      table.string('banner_image').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('kitchen_image', 'image')
      table.dropColumn('banner_image')
    })
  }
}