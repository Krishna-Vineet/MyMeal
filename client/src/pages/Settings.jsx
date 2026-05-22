import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Shield,
  CreditCard,
  LogOut,
  ArrowRight,
  Loader2,
  Globe,
  Lock,
  ChefHat,
  Mail,
  ShoppingBag,
  X,
  MessageCircle,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useAuthStore from "../store/authStore"
import { authService } from "../services/authService"
import { paymentService } from "../services/paymentService"
import { getApiErrorMessage } from "../api/axios"
import useToastStore from "../store/toastStore"
import MotionPage from "../components/MotionPage"

const PREFS_KEY = "mymeal-preferences"

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}")
  } catch {
    return {}
  }
}

export default function Settings() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user: storedUser, logout: logoutStore, setUser } = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)

  const [active, setActive] = useState(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")
  const [deactivatePassword, setDeactivatePassword] = useState("")

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: !!storedUser,
  })

  useEffect(() => {
    if (profile) {
      setName(profile.name || "")
      setPhone(profile.phone || "")
    }
  }, [profile])

  const { data: wallet, error: walletError } = useQuery({
    queryKey: ["wallet-status"],
    queryFn: () => paymentService.walletStatus(),
    enabled: !!profile && profile.role === "cook" && active === "payments",
  })

  const updateProfileMutation = useMutation({
    mutationFn: () => authService.updateProfile({ name: name.trim(), phone: phone.trim() }),
    onSuccess: (data) => {
      setUser(data)
      qc.invalidateQueries({ queryKey: ["profile"] })
      qc.invalidateQueries({ queryKey: ["profile-full"] })
      addToast("Profile updated", "success")
      setActive(null)
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not update profile"), "error"),
  })

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      authService.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirmation,
      }),
    onSuccess: () => {
      addToast("Password changed. Please sign in again.", "success")
      logoutStore()
      navigate("/login")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not change password"), "error"),
  })

  const deactivateMutation = useMutation({
    mutationFn: () => authService.deactivateAccount({ password: deactivatePassword }),
    onSuccess: () => {
      addToast("Account deactivated", "success")
      logoutStore()
      navigate("/")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not deactivate"), "error"),
  })

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (e) {
      console.warn(getApiErrorMessage(e, "Logout request failed"))
    }
    logoutStore()
    addToast("Logged out successfully", "success")
    navigate("/")
  }

  const [prefsDraft, setPrefsDraft] = useState(() => loadPrefs())

  useEffect(() => {
    if (active === "prefs") {
      setPrefsDraft(loadPrefs())
    }
  }, [active])

  const savePrefs = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefsDraft))
    addToast("Preferences saved on this device", "success")
  }

  const settingsSections = useMemo(
    () => [
      { id: "profile", name: "My Profile", icon: <User className="h-5 w-5" />, desc: "Name and phone" },
      { id: "security", name: "Security", icon: <Lock className="h-5 w-5" />, desc: "Change password" },
      { id: "payments", name: "Payments", icon: <CreditCard className="h-5 w-5" />, desc: "Wallet & billing" },
      { id: "prefs", name: "Preferences", icon: <Globe className="h-5 w-5" />, desc: "Language & notifications" },
    ],
    []
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const supportEmail = "support@mymeal.local"

  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-8 sm:p-10 relative">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />
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
                  <p className="text-2xl font-black text-[#1f1308]">{profile?.name || "—"}</p>
                  <p className="font-bold text-[#8f6f55] flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {profile?.email}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1 text-xs font-black uppercase tracking-widest text-[#a45100] border border-orange-100">
                    {profile?.role === "cook" ? <ChefHat className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
                    {profile?.role} account
                  </div>
                </div>
              </div>

              <div className="mt-12 grid gap-4">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActive(section.id)}
                    className="flex items-center justify-between rounded-3xl bg-white/70 px-6 py-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-orange-100 group border border-orange-50 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#a45100] group-hover:bg-[#1f1308] group-hover:!text-white transition-colors">
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
              <p className="mt-2 text-sm font-bold text-[#8f6f55]">Sign out or permanently deactivate this account.</p>

              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-3 rounded-3xl bg-rose-500 px-6 py-5 font-black !text-white shadow-xl shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95"
                >
                  <LogOut className="h-5 w-5" /> Log out of MyMeal
                </button>
                <button
                  type="button"
                  onClick={() => setActive("deactivate")}
                  className="flex w-full items-center justify-center gap-3 rounded-3xl bg-white border-2 border-rose-100 px-6 py-5 font-black text-rose-500 transition-all hover:bg-rose-50 active:scale-95"
                >
                  Deactivate account
                </button>
              </div>
            </div>

            <div className="hero-gradient grow rounded-4xl p-10 !text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] !text-white/70">Support</p>
                <h2 className="mt-4 text-3xl font-black">Need assistance?</h2>
                <p className="mt-4 !text-white/80 font-medium">
                  Email us anytime — we route neighborhood issues to a human during business hours.
                </p>
              </div>
              <a
                href={`mailto:${supportEmail}?subject=MyMeal%20support`}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-3xl bg-white px-6 py-4 font-black !text-[#1f1308] shadow-lg transition-all hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5" /> Contact Support
              </a>
            </div>
          </div>
        </section>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-[#705743] hover:bg-orange-50"
              onClick={() => {
                setActive(null)
                setCurrentPassword("")
                setNewPassword("")
                setNewPasswordConfirmation("")
                setDeactivatePassword("")
              }}
            >
              <X className="h-5 w-5" />
            </button>

            {active === "profile" && (
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-[#1f1308]">My profile</h3>
                <label className="block text-sm font-bold text-[#4f392a]">
                  Display name
                  <input
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-bold text-[#4f392a]">
                  Phone
                  <input
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  disabled={updateProfileMutation.isPending}
                  onClick={() => updateProfileMutation.mutate()}
                  className="mt-4 w-full rounded-2xl bg-[#1f1308] py-4 font-black !text-white disabled:opacity-60"
                >
                  {updateProfileMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            )}

            {active === "security" && (
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-[#1f1308]">Security</h3>
                <label className="block text-sm font-bold text-[#4f392a]">
                  Current password
                  <input
                    type="password"
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-bold text-[#4f392a]">
                  New password (min 8)
                  <input
                    type="password"
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-bold text-[#4f392a]">
                  Confirm new password
                  <input
                    type="password"
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  disabled={changePasswordMutation.isPending}
                  onClick={() => changePasswordMutation.mutate()}
                  className="mt-4 w-full rounded-2xl bg-[#1f1308] py-4 font-black !text-white disabled:opacity-60"
                >
                  {changePasswordMutation.isPending ? "Updating…" : "Update password"}
                </button>
              </div>
            )}

            {active === "payments" && (
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-[#1f1308]">Payments</h3>
                {profile?.role === "cook" && (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                    {walletError ? (
                      <p className="text-sm font-bold text-red-600">{getApiErrorMessage(walletError, "Wallet unavailable")}</p>
                    ) : wallet ? (
                      <>
                        <p className="text-sm font-bold text-[#8f6f55]">Kitchen</p>
                        <p className="text-lg font-black">{wallet.kitchenName}</p>
                        <p className="mt-2 text-sm font-bold text-[#8f6f55]">Wallet balance</p>
                        <p className="text-2xl font-black text-green-700">₹{wallet.walletBalance}</p>
                      </>
                    ) : (
                      <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                    )}
                  </div>
                )}
                {profile?.role === "consumer" && (
                  <p className="text-sm text-[#614937]">
                    Subscription payments and top-ups appear under{" "}
                    <strong>Subscribe</strong> and your bank/UPI statements. Card vault is not enabled in this build.
                  </p>
                )}
                <p className="text-xs font-bold text-[#8f6f55]">Payouts for cooks: use Payments → Payout from the cook app when exposed in UI.</p>
              </div>
            )}

            {active === "prefs" && (
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-[#1f1308]">Preferences</h3>
                <label className="block text-sm font-bold text-[#4f392a]">
                  Language
                  <select
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={prefsDraft.language || "en"}
                    onChange={(e) => setPrefsDraft((p) => ({ ...p, language: e.target.value }))}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-[#4f392a]">
                  <input
                    type="checkbox"
                    checked={!!prefsDraft.emailOrders}
                    onChange={(e) => setPrefsDraft((p) => ({ ...p, emailOrders: e.target.checked }))}
                  />
                  Email me about orders
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-[#4f392a]">
                  <input
                    type="checkbox"
                    checked={!!prefsDraft.pushPickup}
                    onChange={(e) => setPrefsDraft((p) => ({ ...p, pushPickup: e.target.checked }))}
                  />
                  Pickup reminders (this device)
                </label>
                <button
                  type="button"
                  onClick={savePrefs}
                  className="mt-4 w-full rounded-2xl bg-[#1f1308] py-4 font-black !text-white"
                >
                  Save preferences
                </button>
              </div>
            )}

            {active === "deactivate" && (
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-rose-700">Deactivate account</h3>
                <p className="text-sm text-[#614937]">
                  You will be signed out everywhere and cannot log in again until support re-opens the account.
                </p>
                <label className="block text-sm font-bold text-[#4f392a]">
                  Confirm with your password
                  <input
                    type="password"
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={deactivatePassword}
                    onChange={(e) => setDeactivatePassword(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  disabled={deactivateMutation.isPending}
                  onClick={() => deactivateMutation.mutate()}
                  className="w-full rounded-2xl bg-rose-600 py-4 font-black !text-white disabled:opacity-60"
                >
                  {deactivateMutation.isPending ? "Deactivating…" : "Deactivate permanently"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </MotionPage>
  )
}
