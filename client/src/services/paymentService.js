import api from "../api/axios"

export const paymentService = {
  recordPayment: async (payload) => {
    const { data } = await api.post("payments", payload)
    return data
  },

  listForSubscription: async (subscriptionId) => {
    const { data } = await api.get(`payments/subscription/${subscriptionId}`)
    return data
  },

  walletStatus: async () => {
    const { data } = await api.get("payments/wallet/status")
    return data
  },

  requestPayout: async (amount) => {
    const { data } = await api.post("payments/payout", { amount })
    return data
  },
}
