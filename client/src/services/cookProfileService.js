import api from "../api/axios"

export const cookProfileService = {
  create: async (payload) => {
    const { data } = await api.post("cook-profiles", payload)
    return data
  },

  update: async (payload) => {
    const { data } = await api.patch("cook-profiles", payload)
    return data
  },
}
