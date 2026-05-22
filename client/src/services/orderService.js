import api from "../api/axios"

/** Cook API returns orders grouped by ISO date string */
export function flattenCookOrders(grouped) {
  if (!grouped) return []
  if (Array.isArray(grouped)) return grouped.map((o) => normalizeOrder(o))
  const dates = Object.keys(grouped).sort()
  const out = []
  for (const d of dates) {
    for (const o of grouped[d]) {
      out.push({ ...normalizeOrder(o), _bucketDate: d })
    }
  }
  return out
}

export function normalizeOrder(order) {
  if (!order) return order
  const sub = order.subscription
  return {
    ...order,
    mealPlan: sub?.mealPlan ?? order.mealPlan,
    pickupSlot: sub?.pickupSlot ?? order.pickupSlot,
    displayDate: order.orderDate ?? order.createdAt,
  }
}

export const orderService = {
  getOrdersForCook: async () => {
    const { data } = await api.get("orders/cook")
    return flattenCookOrders(data)
  },

  getOrdersForConsumer: async () => {
    const { data } = await api.get("orders/consumer")
    return Array.isArray(data) ? data.map(normalizeOrder) : []
  },

  updateOrderStatus: async (id, status) => {
    const { data } = await api.patch(`orders/${id}/status`, { status })
    return data
  },

  getOrderNotes: async (orderId) => {
    const { data } = await api.get(`orders/${orderId}/notes`)
    return data
  },

  addOrderNote: async (orderId, note) => {
    const { data } = await api.post(`orders/${orderId}/notes`, { note })
    return data
  },
}
