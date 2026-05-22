import { create } from "zustand"

const storedUser = typeof window !== "undefined" ? localStorage.getItem("mymeal-user") : null
const storedToken = typeof window !== "undefined" ? localStorage.getItem("mymeal-token") : null

const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,

  login: (user, token) =>
    set(() => {
      localStorage.setItem("mymeal-user", JSON.stringify(user))
      localStorage.setItem("mymeal-token", token)

      return { user, token }
    }),

  setUser: (user) =>
    set(() => {
      if (user) {
        localStorage.setItem("mymeal-user", JSON.stringify(user))
      }
      return { user }
    }),

  logout: () =>
    set(() => {
      localStorage.removeItem("mymeal-user")
      localStorage.removeItem("mymeal-token")

      return { user: null, token: null }
    }),
}))

export default useAuthStore
