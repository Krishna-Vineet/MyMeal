import { OrderNoteSchema } from '#database/schema'
import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import Order from '#models/order'
import User from '#models/user'

export default class OrderNote extends OrderNoteSchema {
  @beforeCreate()
  static async assignUuid(note: OrderNote) {
    note.id = randomUUID()
  }
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}