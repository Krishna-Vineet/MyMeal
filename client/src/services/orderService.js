import api from "../api/axios"

export const orderService = {
  getOrdersForCook: async () => {
    const response = await api.get("/orders/cook")
    return response.data
  },

  getOrdersForConsumer: async () => {
    const response = await api.get("/orders/consumer")
    return response.data
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },

  getOrderNotes: async (id) => {
    const response = await api.get(`/orders/${id}/notes`)
    return response.data
  },

  addOrderNote: async (id, note) => {
    const response = await api.post(`/orders/${id}/notes`, { note })
    return response.data
  }
}
