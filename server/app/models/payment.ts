import { PaymentSchema } from '#database/schema'
import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import User from '#models/user'
import Subscription from '#models/subscription'
import Order from '#models/order'

export default class Payment extends PaymentSchema {
  @beforeCreate()
  static async assignUuid(payment: Payment) {
    payment.id = randomUUID()
  }
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Subscription)
  declare subscription: BelongsTo<typeof Subscription>

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}