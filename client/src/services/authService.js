import api from "../api/axios"

export const authService = {
  login: async ({ email, password }) => {
    const { data } = await api.post("auth/login", { email, password })
    return { user: data.user, token: data.token, message: data.message }
  },

  register: async (userData) => {
    const { data } = await api.post("auth/register", {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      passwordConfirmation: userData.passwordConfirmation,
      role: userData.role,
    })
    return { user: data.user, token: data.token, message: data.message }
  },

  logout: async () => {
    await api.post("auth/logout")
  },

  /** Profile payload from serializer: `{ data: user }` */
  getProfile: async () => {
    const { data } = await api.get("account/profile")
    return data.data
  },

  updateProfile: async (payload) => {
    const { data } = await api.patch("account/profile", payload)
    return data.data
  },

  changePassword: async (payload) => {
    const { data } = await api.patch("account/profile/password", payload)
    return data
  },

  deactivateAccount: async (payload) => {
    const { data } = await api.post("account/profile/deactivate", payload)
    return data
  },
}
