import { useEffect } from "react"
import AppRouter from "./routes/AppRouter"
import Toast from "./components/Toast"
import useAuthStore from "./store/authStore"
import { authService } from "./services/authService"

function App() {
  const { token, login, logout } = useAuthStore()

  useEffect(() => {
    const fetchProfile = async () => {
      const savedToken = localStorage.getItem("mymeal-token")
      if (savedToken) {
        try {
          const profile = await authService.getProfile()
          login(profile, savedToken)
        } catch (e) {
          console.error("Session expired or invalid")
          logout()
        }
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [])

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}

export default App