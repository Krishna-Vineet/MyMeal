import api from "../api/axios"

export const reviewService = {
  listForCook: async (cookId) => {
    const { data } = await api.get(`reviews/cook/${cookId}`)
    return data
  },

  create: async (payload) => {
    const { data } = await api.post("reviews", payload)
    return data
  },
}
