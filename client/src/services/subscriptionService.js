import api from "../api/axios"

export const subscriptionService = {
  getSubscriptions: async () => {
    const { data } = await api.get("subscriptions")
    return data
  },

  getSubscriptionById: async (id) => {
    const { data } = await api.get(`subscriptions/${id}`)
    return data
  },

  createSubscription: async (payload) => {
    const { data } = await api.post("subscriptions", payload)
    return data
  },

  updateSubscription: async (id, payload) => {
    const { data } = await api.patch(`subscriptions/${id}`, payload)
    return data
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`subscriptions/${id}/status`, { status })
    return data
  },
}
