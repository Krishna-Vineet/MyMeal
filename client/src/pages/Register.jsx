import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserPlus, User, ChefHat, Mail, Lock, Loader2, ArrowRight, Phone } from "lucide-react"
import useAuthStore from "../store/authStore"
import useToastStore from "../store/toastStore"
import { authService } from "../services/authService"
import MotionPage from "../components/MotionPage"

export default function Register() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)
  const addToast = useToastStore((state) => state.addToast)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirmation: "",
    role: "consumer"
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (formData.password !== formData.passwordConfirmation) {
      addToast("Passwords do not match", "error")
      return
    }

    setLoading(true)

    try {
      const response = await authService.register(formData)
      const { user, token } = response
      
      loginStore(user, token)

      addToast(`Account created, welcome ${user.name}!`, "success")
      navigate(user.role === "cook" ? "/cook/profile" : "/app/discover")
    } catch (error) {
       console.error(error)
       addToast(error.response?.data?.message || "Registration failed. Please check your details.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MotionPage>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <aside className="soft-card rounded-[2.5rem] p-10 flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Join MyMeal
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Set up your home meal profile.</h1>
          <p className="mt-4 text-lg text-[#614937]">
            Build your personalized experience—whether you're searching for kitchens or managing your own.
          </p>
          
          <div className="mt-10 space-y-4">
            <div className="rounded-2xl bg-white/80 p-5 border border-orange-50 transition-all hover:shadow-lg">
              <p className="font-black text-[#1f1308]">🍴 Consumers</p>
              <p className="mt-2 text-sm text-[#6f5540]">Find neighborhood cooks and locked subscription plans.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-5 border border-orange-50 transition-all hover:shadow-lg">
              <p className="font-black text-[#1f1308]">👨‍🍳 Kitchens</p>
              <p className="mt-2 text-sm text-[#6f5540]">Publish your menu and manage pickup slots for residents.</p>
            </div>
          </div>
          
          <div className="mt-auto pt-10">
             <div className="hero-gradient rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                <p className="font-bold">Neighborhood focused</p>
                <p className="text-sm opacity-80 mt-1">Join local residents today.</p>
             </div>
          </div>
        </aside>

        <section className="glass-panel rounded-[2.5rem] p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#4f392a]">
                    <User className="h-4 w-4 text-[#8f6f55]" /> Full Name
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-[1.25rem] border border-orange-100 bg-white px-5 py-4 outline-none ring-0 transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#4f392a]">
                    <Mail className="h-4 w-4 text-[#8f6f55]" /> Email
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-[1.25rem] border border-orange-100 bg-white px-5 py-4 outline-none ring-0 transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#4f392a]">
                    <Phone className="h-4 w-4 text-[#8f6f55]" /> Phone
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-[1.25rem] border border-orange-100 bg-white px-5 py-4 outline-none ring-0 transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    className="w-full rounded-[1.25rem] border border-orange-100 bg-white px-5 py-4 outline-none ring-0 transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#4f392a]">
                    <Lock className="h-4 w-4 text-[#8f6f55]" /> Confirm
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.passwordConfirmation}
                    onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                    className="w-full rounded-[1.25rem] border border-orange-100 bg-white px-5 py-4 outline-none ring-0 transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#4f392a]">
                  Select Account Type
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "consumer" })}
                    className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all ${
                      formData.role === "consumer"
                        ? "bg-[#1f1308] text-white shadow-xl shadow-orange-200"
                        : "bg-white border border-orange-100 text-[#614937] hover:bg-orange-50"
                    }`}
                  >
                    Consumer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "cook" })}
                    className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all ${
                      formData.role === "cook"
                        ? "bg-[#1f1308] text-white shadow-xl shadow-orange-200"
                        : "bg-white border border-orange-100 text-[#614937] hover:bg-orange-50"
                    }`}
                  >
                    Cook
                  </button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-3xl hero-gradient px-6 py-5 font-black text-white shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Create Account"} 
                {!loading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-[#705743]">
            Already have an account? <Link to="/login" className="text-[#b85e00] hover:underline">Login instead</Link>.
          </p>
        </section>
      </div>
    </MotionPage>
  )
}
