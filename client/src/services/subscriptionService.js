import api from "../api/axios"

export const subscriptionService = {
  getSubscriptions: async () => {
    const response = await api.get("/subscriptions")
    return response.data
  },

  getSubscriptionById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`)
    return response.data
  },

  createSubscription: async (data) => {
    const response = await api.post("/subscriptions", data)
    return response.data
  },

  updateSubscription: async (id, data) => {
    const response = await api.patch(`/subscriptions/${id}`, data)
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/subscriptions/${id}/status`, { status })
    return response.data
  }
}
