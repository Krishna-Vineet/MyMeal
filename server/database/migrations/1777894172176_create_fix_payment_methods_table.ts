import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
        // We drop and recreate the method enum/check constraint with more values
        table.enum('method', ['upi', 'card', 'cash', 'advance_payment', 'mock_wallet', 'transfer']).alter()
        table.enum('status', ['pending', 'success', 'failed', 'completed']).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
        table.enum('method', ['upi', 'card', 'cash']).alter()
        table.enum('status', ['pending', 'success', 'failed']).alter()
    })
  }
}