import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pickup_slots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('meal_plan_id')
          .notNullable()
          .references('meal_plans.id')
          .onDelete('CASCADE')

      table.string('location_name')
      table.string('address')

      table.decimal('latitude',10,8)
      table.decimal('longitude',11,8)

      table.time('pickup_time')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}