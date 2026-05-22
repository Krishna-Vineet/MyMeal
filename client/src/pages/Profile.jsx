import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, ChefHat, Save } from "lucide-react"
import { authService } from "../services/authService"
import { cookProfileService } from "../services/cookProfileService"
import { mealService } from "../services/mealService"
import MotionPage from "../components/MotionPage"
import useToastStore from "../store/toastStore"
import { getApiErrorMessage } from "../api/axios"

export default function Profile() {
  const addToast = useToastStore((s) => s.addToast)
  const qc = useQueryClient()

  const [formData, setFormData] = useState({
    kitchenName: "",
    bio: "",
    city: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    kitchenImage: ""
  })

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-full"],
    queryFn: () => authService.getProfile(),
  })

  useEffect(() => {
    if (profile?.cookProfile) {
      const cp = profile.cookProfile
      setFormData({
        kitchenName: cp.kitchenName || "",
        bio: cp.bio || "",
        city: cp.city || "",
        address: cp.address || "",
        phone: cp.phone || "",
        latitude: cp.latitude || "",
        longitude: cp.longitude || "",
        kitchenImage: cp.kitchenImage || ""
      })
    }
  }, [profile])

  const { data: mealPlans } = useQuery({
    queryKey: ["meal-plans"],
    queryFn: () => mealService.getPlans(),
    enabled: !!profile?.role && profile.role === "cook",
  })

  const cp = profile?.cookProfile

  const saveKitchenMutation = useMutation({
    mutationFn: () => {
      const payload = {
        kitchenName: formData.kitchenName.trim(),
        bio: formData.bio.trim() || undefined,
        city: formData.city.trim() || undefined,
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        latitude: formData.latitude.trim() || undefined,
        longitude: formData.longitude.trim() || undefined,
        kitchenImage: formData.kitchenImage.trim() || undefined,
      }
      return cp ? cookProfileService.update(payload) : cookProfileService.create(payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile-full"] })
      addToast(cp ? "Kitchen profile updated" : "Kitchen profile created", "success")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not save kitchen"), "error"),
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({ ...prev, kitchenImage: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleFetchCoordinates = () => {
    if (!navigator.geolocation) {
      addToast("Geolocation is not supported by your browser", "error")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }))
        addToast("Coordinates fetched successfully", "success")
      },
      (error) => {
        addToast("Unable to fetch location: " + error.message, "error")
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    )
  }

  if (!profile || profile.role !== "cook") {
    return (
      <MotionPage>
        <p className="text-center font-bold text-[#6e5252]">Cook dashboard only.</p>
      </MotionPage>
    )
  }

  return (
    <MotionPage>
      <div className="space-y-6">
        <section className="hero-gradient rounded-4xl p-8 !text-white shadow-2xl shadow-rose-200/60 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] !text-white/80">Cook profile</p>
            <div className="mt-3 flex items-center gap-4">
              {cp?.kitchenImage && (
                <img src={cp.kitchenImage} alt="Kitchen" className="h-16 w-16 rounded-full object-cover shadow-lg border-2 border-white/20" />
              )}
              <div>
                <h1 className="text-4xl font-black">{cp?.kitchenName || profile.name}</h1>
                <p className="mt-1 max-w-2xl !text-white/80">{cp?.bio || "Tell neighbors what you cook best."}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            [String(mealPlans?.length ?? 0), "Meal plans"],
            ["—", "Pickup slots (see plans)"],
            ["—", "Subscribers (via orders)"],
          ].map(([value, label]) => (
            <article key={label} className="soft-card rounded-4xl p-6">
              <p className="text-3xl font-black text-[#1f1308]">{value}</p>
              <p className="mt-1 text-sm text-[#705743]">{label}</p>
            </article>
          ))}
        </section>

        <section className="soft-card rounded-4xl p-8">
          <h2 className="text-2xl font-black text-[#1f1308] flex items-center gap-2">
            <ChefHat className="h-6 w-6" /> {cp ? "Edit your kitchen" : "Set up your kitchen"}
          </h2>
          <p className="mt-2 text-sm text-[#6e5252]">{cp ? "Update your kitchen details below." : "Required before you can publish meal plans."}</p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-bold md:col-span-2">
              Kitchen name *
              <input
                name="kitchenName"
                className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                value={formData.kitchenName}
                onChange={handleChange}
                placeholder="Asha’s Kitchen"
              />
            </label>
            <label className="block text-sm font-bold md:col-span-2">
              Bio
              <textarea
                name="bio"
                className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of your cooking style"
              />
            </label>
            <label className="block text-sm font-bold">
              City / Area
              <input
                name="city"
                className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                value={formData.city}
                onChange={handleChange}
                placeholder="Baner, Pune"
              />
            </label>
            <label className="block text-sm font-bold">
              Full Address
              <input
                name="address"
                className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Street Name"
              />
            </label>
            <label className="block text-sm font-bold">
              Phone Number
              <input
                name="phone"
                className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </label>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold">
                Latitude
                <input
                  name="latitude"
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="18.5204"
                />
              </label>
              <label className="block text-sm font-bold mt-4">
                Longitude
                <input
                  name="longitude"
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="73.8567"
                />
              </label>
              <button
                type="button"
                onClick={handleFetchCoordinates}
                className="mt-4 rounded-xl bg-orange-100 px-4 py-2 text-sm font-bold text-[#654a36] hover:bg-orange-200 transition-colors"
              >
                Fetch My Coordinates
              </button>
            </div>
            <label className="block text-sm font-bold md:col-span-2">
              Kitchen Image URL
              <div className="mt-2 flex gap-4 items-center">
                <input
                  name="kitchenImage"
                  className="w-full rounded-xl border border-orange-100 px-4 py-3"
                  value={formData.kitchenImage.startsWith('data:') ? 'Base64 Image Uploaded' : formData.kitchenImage}
                  onChange={handleChange}
                  placeholder="https://example.com/kitchen.jpg"
                />
                <span className="font-bold text-[#8f6f55]">OR</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
            </label>
            
            <div className="md:col-span-2 mt-2 flex items-center justify-end">
              <button
                type="button"
                disabled={saveKitchenMutation.isPending || formData.kitchenName.trim().length < 3}
                onClick={() => saveKitchenMutation.mutate()}
                className="flex items-center gap-2 rounded-2xl bg-[#2b0f10] px-6 py-4 font-black !text-white disabled:opacity-50 transition-all hover:bg-[#4a1c1d]"
              >
                <Save className="h-5 w-5" />
                {saveKitchenMutation.isPending ? "Saving…" : (cp ? "Save changes" : "Create kitchen profile")}
              </button>
            </div>
          </div>
        </section>

        {cp && (
          <section className="soft-card rounded-4xl p-6">
            <h2 className="text-2xl font-black text-[#1f1308]">Quick links</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                to="/cook/meal-plans"
                className="rounded-2xl bg-[#2b0f10] px-6 py-3 font-black !text-white"
              >
                Manage meal plans
              </Link>
              <Link to="/cook/orders" className="rounded-2xl border border-rose-100 px-6 py-3 font-black text-[#2b0f10]">
                View orders
              </Link>
            </div>
          </section>
        )}
      </div>
    </MotionPage>
  )
}
