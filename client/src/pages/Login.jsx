import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogIn, User, ChefHat, Mail, Lock, Loader2, ArrowRight, ShoppingBag } from "lucide-react"
import useAuthStore from "../store/authStore"
import useToastStore from "../store/toastStore"
import { authService } from "../services/authService"
import MotionPage from "../components/MotionPage"

export default function Login() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)
  const addToast = useToastStore((state) => state.addToast)
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)
      const { user, token } = response
      loginStore(user, token)

      addToast(`Welcome back, ${user.name}!`, "success")
      navigate(user.role === "cook" ? "/cook/profile" : "/app/discover")
    } catch (error) {
      console.error(error)
      addToast(error.response?.data?.message || "Invalid credentials. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MotionPage>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-panel rounded-[2.5rem] p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <LogIn className="h-4 w-4" /> Welcome back
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Login to your meal routine.</h1>
          <p className="mt-4 text-lg text-[#614937]">
            Enter your credentials to access your dashboard.
          </p>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#4f392a]">
                  <Mail className="h-4 w-4 text-[#8f6f55]" /> Email address
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-[1.25rem] border border-orange-100 bg-white px-5 py-4 outline-none ring-0 transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100 placeholder:text-orange-200"
                />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#4f392a]">
                  <Lock className="h-4 w-4 text-[#8f6f55]" /> Password
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-[1.25rem] border border-orange-100 bg-white px-5 py-4 outline-none ring-0 transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100 placeholder:text-orange-200"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-3xl hero-gradient px-6 py-5 font-black text-white shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Enter MyMeal"} 
                {!loading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              </span>
            </button>
          </form>
        </section>

        <aside className="flex flex-col gap-6">
          <div className="soft-card rounded-[2.5rem] p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6f55]">Onboarding</p>
            <h2 className="mt-4 text-2xl font-black text-[#1f1308]">Everything in one place</h2>
            <div className="mt-8 space-y-4">
              <div className="group rounded-2xl bg-white/80 p-5 transition-all hover:bg-white hover:shadow-lg">
                <p className="font-black text-[#1f1308] flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-orange-500"></div> Consumer
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#6f5540]">Browse meals, subscribe, and review orders from your neighbors.</p>
              </div>
              <div className="group rounded-2xl bg-white/80 p-5 transition-all hover:bg-white hover:shadow-lg">
                <p className="font-black text-[#1f1308] flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-rose-500"></div> Cook
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#6f5540]">Manage your profile, pickup slots, and track daily meal requests.</p>
              </div>
            </div>
            <p className="mt-10 text-center text-sm font-bold text-[#705743]">
              Need a new account? <Link to="/register" className="text-[#b85e00] hover:underline">Create one here</Link>.
            </p>
          </div>
          
          <div className="hero-gradient grow rounded-[2.5rem] p-10 text-white shadow-lg overflow-hidden relative">
             <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
             <p className="text-2xl font-black">Trusted by neighbors</p>
             <p className="mt-4 text-white/80 text-balance">The easiest way to get healthy, home-cooked food every day.</p>
          </div>
        </aside>
      </div>
    </MotionPage>
  )
}
