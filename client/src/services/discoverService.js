import api from "../api/axios"

export const discoverService = {
  getCooks: async () => {
    const response = await api.get("/discover/cooks")
    return response.data
  },

  getCookDetails: async (id) => {
    const response = await api.get(`/discover/cooks/${id}`)
    return response.data
  }
}
