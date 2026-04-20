import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Shield, CreditCard, Bell, LogOut, ArrowRight, Loader2, Globe, Lock, ChefHat, Mail, ShoppingBag } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import useAuthStore from "../store/authStore"
import { authService } from "../services/authService"
import useToastStore from "../store/toastStore"
import MotionPage from "../components/MotionPage"

export default function Settings() {
  const navigate = useNavigate()
  const { user: storedUser, logout: logoutStore } = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: !!storedUser
  })

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (e) {
      console.warn("Logout failed on server, clearing locally anyway")
    }
    localStorage.removeItem("token")
    logoutStore()
    addToast("Logged out successfully", "success")
    navigate("/")
  }

  const settingsSections = [
    { name: "My Profile", icon: <User className="h-5 w-5" />, desc: "Details, address, and food preferences" },
    { name: "Security", icon: <Lock className="h-5 w-5" />, desc: "Password and account protection" },
    { name: "Payments", icon: <CreditCard className="h-5 w-5" />, desc: "Manage cards and wallet" },
    { name: "Preferences", icon: <Globe className="h-5 w-5" />, desc: "Area, language, and notifications" },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-8 sm:p-10 relative">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <Shield className="h-4 w-4" /> Account
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Settings & Preferences.</h1>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="soft-card rounded-4xl p-8">
              <h2 className="text-2xl font-black text-[#1f1308]">Account Profile</h2>
              <div className="mt-8 flex items-center gap-6">
                <div className="h-24 w-24 rounded-3xl bg-orange-100 flex items-center justify-center text-3xl font-black text-[#a45100] shadow-lg shadow-orange-100">
                  {profile?.name?.[0] || "?"}
                </div>
                <div>
                   <p className="text-2xl font-black text-[#1f1308]">{profile?.name || "Loading..."}</p>
                   <p className="font-bold text-[#8f6f55] flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {profile?.email}
                   </p>
                   <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1 text-xs font-black uppercase tracking-widest text-[#a45100] border border-orange-100">
                      {profile?.role === 'cook' ? <ChefHat className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
                      {profile?.role} account
                   </div>
                </div>
              </div>

              <div className="mt-12 grid gap-4">
                {settingsSections.map((section) => (
                  <button key={section.name} className="flex items-center justify-between rounded-3xl bg-white/70 px-6 py-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-orange-100 group border border-orange-50">
                    <div className="flex items-center gap-4 text-left">
                       <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#a45100] group-hover:bg-[#1f1308] group-hover:text-white transition-colors">
                          {section.icon}
                       </div>
                       <div>
                         <p className="font-black text-[#1f1308]">{section.name}</p>
                         <p className="text-xs font-bold text-[#8f6f55]">{section.desc}</p>
                       </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-orange-200 group-hover:text-[#1f1308] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="soft-card rounded-4xl p-8 bg-rose-50/30 border-rose-100">
              <h2 className="text-2xl font-black text-[#1f1308]">Danger Zone</h2>
              <p className="mt-2 text-sm font-bold text-[#8f6f55]">Managed with care. Any changes here are immediate.</p>
              
              <div className="mt-8 space-y-4">
                 <button 
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-3 rounded-3xl bg-rose-500 px-6 py-5 font-black text-white shadow-xl shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95"
                 >
                    <LogOut className="h-5 w-5" /> Log out of MyMeal
                 </button>
                 <button className="flex w-full items-center justify-center gap-3 rounded-3xl bg-white border-2 border-rose-100 px-6 py-5 font-black text-rose-500 transition-all hover:bg-rose-50 active:scale-95">
                    Deactivate account
                 </button>
              </div>
            </div>

            <div className="hero-gradient grow rounded-4xl p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
               <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
               <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Support</p>
                  <h2 className="mt-4 text-3xl font-black">Need assistance?</h2>
                  <p className="mt-4 text-white/80 font-medium">Our neighborhood support team is here to help with your meals, subscriptions, or cook profile.</p>
               </div>
               <button className="mt-8 w-full rounded-3xl bg-white px-6 py-4 font-black text-[#1f1308] shadow-lg transition-all hover:-translate-y-1">
                  Contact Support
               </button>
            </div>
          </div>
        </section>
      </div>
    </MotionPage>
  )
}
