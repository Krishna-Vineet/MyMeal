import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_notes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('user_id').references('users.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id')
    })
  }
}