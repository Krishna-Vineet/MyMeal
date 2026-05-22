import api from "../api/axios"

export const discoverService = {
  getCooks: async (params = {}) => {
    const { data } = await api.get("discover/cooks", { params })
    return data
  },

  getCookDetails: async (id) => {
    const { data } = await api.get(`discover/cooks/${id}`)
    return data
  },
}
