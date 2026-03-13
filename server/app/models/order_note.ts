import { OrderNoteSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Order from '#models/order'
import User from '#models/user'

export default class OrderNote extends OrderNoteSchema {
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}