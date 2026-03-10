import { OrderNoteSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Order from '#models/order'

export default class OrderNote extends OrderNoteSchema {
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}