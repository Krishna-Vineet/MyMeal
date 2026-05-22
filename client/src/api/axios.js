import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333/api/v1",
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mymeal-token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Maps Adonis / Vine validation errors and API messages to a single string.
 */
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const res = error?.response
  if (!res) return error?.message || fallback

  const body = res.data
  if (!body) return fallback

  if (typeof body === "string") return body

  if (body.message) {
    if (Array.isArray(body.message)) return body.message.join(", ")
    return String(body.message)
  }

  // Vine / Adonis validation
  if (Array.isArray(body.errors)) {
    return body.errors.map((e) => e.message || e.msg || String(e)).join(", ")
  }

  if (body.errors && typeof body.errors === "object") {
    const msgs = []
    for (const [, val] of Object.entries(body.errors)) {
      if (Array.isArray(val)) msgs.push(...val.map(String))
      else msgs.push(String(val))
    }
    if (msgs.length) return msgs.join(", ")
  }

  return fallback
}

export default api
