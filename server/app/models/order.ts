import { OrderSchema } from '#database/schema'
import { belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'

import Subscription from '#models/subscription'
import OrderNote from '#models/order_note'

export default class Order extends OrderSchema {
  @belongsTo(() => Subscription)
  declare subscription: BelongsTo<typeof Subscription>

  @hasOne(() => OrderNote)
  declare note: HasOne<typeof OrderNote>
}