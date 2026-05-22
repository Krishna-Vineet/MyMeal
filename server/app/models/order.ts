import { OrderSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import Subscription from '#models/subscription'
import OrderNote from '#models/order_note'

export default class Order extends OrderSchema {
  @beforeCreate()
  static async assignUuid(order: Order) {
    order.id = randomUUID()
  }
  @belongsTo(() => Subscription)
  declare subscription: BelongsTo<typeof Subscription>

  @hasOne(() => OrderNote)
  declare note: HasOne<typeof OrderNote>
}