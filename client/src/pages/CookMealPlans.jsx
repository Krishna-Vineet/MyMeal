import { useMemo, useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Plus, Trash2, UtensilsCrossed, ImageIcon, Upload, X } from "lucide-react"
import { mealService } from "../services/mealService"
import MotionPage from "../components/MotionPage"
import useToastStore from "../store/toastStore"
import { getApiErrorMessage } from "../api/axios"

const DURATION_OPTIONS = [
  { value: "one_time", label: "One time" },
  { value: "1_week", label: "1 week" },
  { value: "2_week", label: "2 weeks" },
  { value: "1_month", label: "1 month" },
  { value: "3_month", label: "3 months" },
]

const VALIDITY_OPTIONS = [
  { value: "all_days", label: "All days" },
  { value: "weekdays", label: "Weekdays only" },
  { value: "weekends", label: "Weekends only" },
]

function normalizeTime(t) {
  if (!t) return "12:00:00"
  if (t.length <= 5) return `${t}:00`
  return t
}

function emptyComponent() {
  return {
    name: "",
    price: 0,
    defaultQuantity: 0,
    maxQuantity: 4,
    isToggle: false,
  }
}

function emptySlot() {
  return {
    locationName: "",
    address: "",
    latitude: "",
    longitude: "",
    pickupTime: "12:00",
  }
}

export default function CookMealPlans() {
  const addToast = useToastStore((s) => s.addToast)
  const qc = useQueryClient()

  const [showBuilder, setShowBuilder] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [basePrice, setBasePrice] = useState(199)
  const [subscriberLimit, setSubscriberLimit] = useState(20)
  const [isActive, setIsActive] = useState(true)
  const [validityType, setValidityType] = useState("all_days")
  const [bannerUrl, setBannerUrl] = useState("")
  const [bannerFile, setBannerFile] = useState(null)
  const [availableDurations, setAvailableDurations] = useState(() => new Set(["1_month"]))
  const [components, setComponents] = useState([emptyComponent()])
  const [pickupSlots, setPickupSlots] = useState([emptySlot()])
  const [editingId, setEditingId] = useState(null)

  const bannerFileRef = useRef(null)

  // 1. Persistence Logic: Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("meal_plan_draft")
    if (draft) {
      try {
        const data = JSON.parse(draft)
        setTitle(data.title || "")
        setDescription(data.description || "")
        setBasePrice(data.basePrice || 199)
        setSubscriberLimit(data.subscriberLimit || 20)
        setIsActive(data.isActive ?? true)
        setValidityType(data.validityType || "all_days")
        setBannerUrl(data.bannerUrl || "")
        setAvailableDurations(new Set(data.availableDurations || ["1_month"]))
        setComponents(data.components || [emptyComponent()])
        setPickupSlots(data.pickupSlots || [emptySlot()])
        // We removed auto-opening the builder so the user only sees it when explicitly clicked.
      } catch (e) {
        console.error("Failed to load draft", e)
      }
    }
  }, [])

  // 2. Save draft when fields change
  useEffect(() => {
    if (!showBuilder || editingId) return
    const draft = {
      title,
      description,
      basePrice,
      subscriberLimit,
      isActive,
      validityType,
      bannerUrl,
      availableDurations: [...availableDurations],
      components,
      pickupSlots,
    }
    localStorage.setItem("meal_plan_draft", JSON.stringify(draft))
  }, [title, description, basePrice, subscriberLimit, isActive, validityType, bannerUrl, availableDurations, components, pickupSlots, showBuilder])

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["meal-plans"],
    queryFn: () => mealService.getPlans(),
  })

  const resetBuilder = () => {
    setTitle("")
    setDescription("")
    setBasePrice(199)
    setSubscriberLimit(20)
    setIsActive(true)
    setValidityType("all_days")
    setBannerUrl("")
    setBannerFile(null)
    setAvailableDurations(new Set(["1_month"]))
    setComponents([emptyComponent()])
    setPickupSlots([emptySlot()])
    setEditingId(null)
    localStorage.removeItem("meal_plan_draft")
  }

  const toggleDuration = (value) => {
    setAvailableDurations((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  const payload = useMemo(() => {
    const durs = [...availableDurations]
    if (!durs.length) durs.push("1_month")
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      basePrice: Number(basePrice) || 0,
      subscriberLimit: subscriberLimit ? Number(subscriberLimit) : undefined,
      bannerImage: bannerUrl.trim() || undefined,
      isActive,
      validityType,
      availableDurations: durs,
      components: components.map((c) => {
        const comp = {
          name: c.name.trim(),
          price: Number(c.price) || 0,
          defaultQuantity: Number(c.defaultQuantity) || 0,
          maxQuantity: Math.max(1, Number(c.maxQuantity) || 1),
          isToggle: !c.isToggle,
        }
        if (c.id) comp.id = c.id
        return comp
      }),
      pickupSlots: pickupSlots.map((s) => {
        const slot = {
          locationName: s.locationName.trim(),
          address: s.address?.trim() || undefined,
          latitude: s.latitude?.trim() || undefined,
          longitude: s.longitude?.trim() || undefined,
          pickupTime: normalizeTime(s.pickupTime),
        }
        if (s.id) slot.id = s.id
        return slot
      }),
    }
  }, [
    title,
    description,
    basePrice,
    subscriberLimit,
    bannerUrl,
    isActive,
    validityType,
    availableDurations,
    components,
    pickupSlots,
  ])

  const createMutation = useMutation({
    mutationFn: () => {
        const formData = new FormData()
        Object.entries(payload).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (key === 'components' || key === 'pickupSlots' || key === 'availableDurations') {
                formData.append(key, JSON.stringify(value))
            } else {
                formData.append(key, value)
            }
        })
        if (bannerFile) {
            formData.append('bannerFile', bannerFile)
        }
        if (editingId) {
            return mealService.updatePlan(editingId, formData)
        }
        return mealService.createPlan(formData)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meal-plans"] })
      addToast(editingId ? "Meal plan updated" : "Meal plan created", "success")
      setShowBuilder(false)
      resetBuilder()
    },
    onError: (e) => addToast(getApiErrorMessage(e, editingId ? "Could not update plan" : "Could not create plan"), "error"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mealService.deletePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meal-plans"] })
      addToast("Meal plan deleted", "success")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not delete plan"), "error"),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => mealService.updatePlan(id, { isActive: !isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meal-plans"] })
      addToast("Status updated", "success")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not update status"), "error"),
  })

  const handleEdit = (plan) => {
    setEditingId(plan.id)
    setTitle(plan.title)
    setDescription(plan.description || "")
    setBasePrice(plan.basePrice)
    setSubscriberLimit(plan.subscriberLimit || 20)
    setIsActive(plan.isActive)
    setValidityType(plan.validityType)
    setBannerUrl(plan.bannerImage || "")
    setAvailableDurations(new Set(plan.availableDurations || ["1_month"]))
    setComponents(plan.mealComponents || [emptyComponent()])
    setPickupSlots(plan.pickupSlots?.map(s => ({
        ...s,
        pickupTime: s.pickupTime?.slice(0, 5) || "12:00"
    })) || [emptySlot()])
    setShowBuilder(true)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (payload.title.length < 3) {
      addToast("Title must be at least 3 characters", "error")
      return
    }
    if (payload.components.some((c) => c.name.length < 2)) {
      addToast("Each add-on needs a name (min 2 characters)", "error")
      return
    }
    if (payload.pickupSlots.some((s) => s.locationName.length < 2)) {
      addToast("Each pickup slot needs a location name", "error")
      return
    }
    
    if (editingId) {
        // Full update for MVP: we delete and recreate components/slots in backend if complex,
        // but currently our update endpoint only handles top-level.
        // For a full edit, we might need a specific "replace" endpoint or just update base.
        // Let's assume updatePlan handles the payload for now.
        const updatePayload = { ...payload }
        // Note: we'd need to update the service to handle FormData for PATCH if we want to change banner file
        // For now, we'll just use the createMutation logic if it's FormData.
        
        // Actually, let's just make createMutation handle both if editingId exists
    }

    createMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    )
  }

  if (error) {
    return (
      <MotionPage>
        <p className="text-center font-bold text-red-600">
          {getApiErrorMessage(error, "Could not load meal plans")}
        </p>
        <p className="mt-2 text-center text-sm text-[#705743]">Create your cook profile first if you have not set up a kitchen yet.</p>
      </MotionPage>
    )
  }

  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel rounded-[2.5rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b6767]">Kitchen</p>
              <h1 className="mt-2 text-3xl font-black text-[#2b0f10]">Meal plans</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                resetBuilder()
                setShowBuilder(true)
              }}
              className="rounded-2xl bg-[#2b0f10] px-6 py-3 font-black !text-white shadow-lg"
            >
              New meal plan
            </button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {(plans || []).map((p) => (
            <article key={p.id} className="soft-card flex flex-col justify-between rounded-[2rem] overflow-hidden">
              {p.bannerImage && (
                <div className="aspect-video w-full overflow-hidden bg-orange-50">
                  <img src={p.bannerImage} alt={p.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex flex-col justify-between flex-1 p-8">
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="h-6 w-6 text-rose-600 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-[#2b0f10]">{p.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#6e5252] line-clamp-2">{p.description}</p>
                  <p className="mt-4 text-2xl font-black text-rose-700">₹{p.basePrice}</p>
                <p className="mt-2 text-sm text-[#614937]">
                  Validity: {p.validityType === "all_days" ? "All days" : p.validityType === "weekdays" ? "Weekdays only" : p.validityType === "weekends" ? "Weekends only" : ""}
                </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#8b6767]">
                    {p.mealComponents?.length || 0} add-ons · {p.pickupSlots?.length || 0} slots
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 border-t border-rose-50 pt-6">
                <button
                  onClick={() => toggleMutation.mutate({ id: p.id, isActive: p.isActive })}
                  disabled={toggleMutation.isPending}
                  className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100"
                >
                  {p.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(p)}
                  className="rounded-xl bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this plan?")) {
                      deleteMutation.mutate(p.id)
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="ml-auto rounded-xl p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              </div>
            </article>
          ))}
        </section>

        {(plans || []).length === 0 && !showBuilder && (
          <p className="text-center text-[#6e5252]">No plans yet — tap &quot;New meal plan&quot; to build your menu.</p>
        )}
      </div>

      {showBuilder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 py-10">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl space-y-8 rounded-[2rem] bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-[#2b0f10]">Meal plan builder</h2>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-bold text-[#6e5252] hover:bg-rose-50"
                onClick={() => setShowBuilder(false)}
              >
                Close
              </button>
            </div>

            <section className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/30 p-6">
              <h3 className="font-black text-[#2b0f10]">Basics</h3>
              <label className="block text-sm font-bold">
                <div className="flex justify-between items-center">
                    <span>Title *</span>
                    <span className={`text-[10px] ${title.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>{title.length}/50</span>
                </div>
                <input
                  required
                  minLength={3}
                  maxLength={50}
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="North Indian lunch thali"
                />
              </label>
              <label className="block text-sm font-bold">
                <div className="flex justify-between items-center">
                    <span>Description</span>
                    <span className={`text-[10px] ${description.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>{description.length}/500</span>
                </div>
                <textarea
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                  rows={3}
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold">
                  Base price (₹ / day) *
                  <input
                    type="number"
                    min={0}
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-bold">
                  Subscriber cap
                  <input
                    type="number"
                    min={1}
                    className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                    value={subscriberLimit}
                    onChange={(e) => setSubscriberLimit(e.target.value)}
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Plan is active (visible to consumers)
              </label>
              <div>
                <p className="text-sm font-bold mb-2">Banner image</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-[10px] font-bold text-gray-500">
                        Enter Image URL
                        <input
                            className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-3 text-sm text-black"
                            value={bannerUrl}
                            disabled={!!bannerFile}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            placeholder="https://…"
                        />
                    </label>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500">Or Upload File (Max 25MB)</span>
                        {bannerFile ? (
                            <div className="mt-1 flex items-center justify-between rounded-xl bg-orange-50 p-3 border border-orange-200">
                                <span className="text-xs font-bold truncate max-w-[150px]">{bannerFile.name}</span>
                                <button type="button" onClick={() => setBannerFile(null)} className="text-rose-500"><X className="h-4 w-4"/></button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => bannerFileRef.current?.click()}
                                className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-200 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                            >
                                <Upload className="h-4 w-4" /> Select Image
                            </button>
                        )}
                        <input
                            type="file"
                            ref={bannerFileRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    if (file.size > 25 * 1024 * 1024) {
                                        addToast("File size exceeds 25MB", "error")
                                        return
                                    }
                                    setBannerFile(file)
                                    setBannerUrl("")
                                }
                            }}
                        />
                    </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">Validity</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {VALIDITY_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setValidityType(o.value)}
                      className={`rounded-full px-4 py-2 text-sm font-black ${
                        validityType === o.value ? "bg-[#2b0f10] !text-white" : "bg-white border border-rose-100"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">Allowed subscription lengths</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggleDuration(o.value)}
                      className={`rounded-full px-4 py-2 text-sm font-black ${
                        availableDurations.has(o.value) ? "bg-rose-600 !text-white" : "bg-white border border-rose-100"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-orange-100 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-[#2b0f10]">Meal add-ons & extras</h3>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-orange-100 px-4 py-2 text-sm font-black text-orange-900"
                  onClick={() => setComponents((c) => [...c, emptyComponent()])}
                >
                  <Plus className="h-4 w-4" /> Add row
                </button>
              </div>
              {components.map((row, i) => (
                <div key={i} className="grid gap-3 rounded-xl border border-orange-50 bg-white/80 p-4 md:grid-cols-12">
                  <label className="md:col-span-4 text-xs font-bold">
                    Name *
                    <input
                      className="mt-1 w-full rounded-lg border border-orange-400 px-3 py-2"
                      value={row.name}
                      onChange={(e) => {
                        const next = [...components]
                        next[i] = { ...row, name: e.target.value }
                        setComponents(next)
                      }}
                    />
                  </label>
                  <label className="md:col-span-2 text-xs font-bold">
                    Price ₹
                    <input
                      type="number"
                      min={0}
                      className="mt-1 w-full rounded-lg border border-orange-400 px-3 py-2"
                      value={row.price}
                      onChange={(e) => {
                        const next = [...components]
                        next[i] = { ...row, price: e.target.value }
                        setComponents(next)
                      }}
                    />
                  </label>
                  <label className="md:col-span-2 text-xs font-bold">
                    Default qty
                    <input
                      type="number"
                      min={0}
                      className="mt-1 w-full rounded-lg border border-orange-400 px-3 py-2"
                      value={row.defaultQuantity}
                      onChange={(e) => {
                        const next = [...components]
                        next[i] = { ...row, defaultQuantity: e.target.value }
                        setComponents(next)
                      }}
                    />
                  </label>
                  <label className="md:col-span-2 text-xs font-bold">
                    Max qty
                    <input
                      type="number"
                      min={1}
                      className="mt-1 w-full rounded-lg border border-orange-400 px-3 py-2"
                      value={row.maxQuantity}
                      onChange={(e) => {
                        const next = [...components]
                        next[i] = { ...row, maxQuantity: e.target.value }
                        setComponents(next)
                      }}
                    />
                  </label>
                  <label className="md:col-span-1 flex flex-col justify-end text-xs font-bold">
                    <span className="mb-1">Toggle</span>
                    <input
                      type="checkbox"
                      checked={!!row.isToggle}
                      onChange={(e) => {
                        const next = [...components]
                        next[i] = { ...row, isToggle: e.target.checked }
                        setComponents(next)
                      }}
                    />
                  </label>
                  <div className="md:col-span-1 flex items-end justify-end">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                      disabled={components.length <= 1}
                      onClick={() => setComponents((c) => c.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-4 rounded-2xl border border-orange-100 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-[#2b0f10]">Pickup slots</h3>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-orange-100 px-4 py-2 text-sm font-black text-orange-900"
                  onClick={() => setPickupSlots((s) => [...s, emptySlot()])}
                >
                  <Plus className="h-4 w-4" /> Add slot
                </button>
              </div>
              {pickupSlots.map((row, i) => (
                <div key={i} className="grid gap-3 rounded-xl border border-orange-50 bg-white/80 p-4 md:grid-cols-12">
                  <label className="md:col-span-4 text-xs font-bold">
                    Location name *
                    <input
                      className="mt-1 w-full rounded-lg border border-orange-400 px-3 py-2"
                      value={row.locationName}
                      onChange={(e) => {
                        const next = [...pickupSlots]
                        next[i] = { ...row, locationName: e.target.value }
                        setPickupSlots(next)
                      }}
                    />
                  </label>
                  <label className="md:col-span-3 text-xs font-bold">
                    Pickup time *
                    <input
                      type="time"
                      className="mt-1 w-full rounded-lg border border-orange-400 px-3 py-2"
                      value={row.pickupTime?.slice(0, 5) || "12:00"}
                      onChange={(e) => {
                        const next = [...pickupSlots]
                        next[i] = { ...row, pickupTime: e.target.value }
                        setPickupSlots(next)
                      }}
                    />
                  </label>
                  <label className="md:col-span-5 text-xs font-bold">
                    Address (optional)
                    <input
                      className="mt-1 w-full rounded-lg border border-orange-400 px-3 py-2"
                      value={row.address}
                      onChange={(e) => {
                        const next = [...pickupSlots]
                        next[i] = { ...row, address: e.target.value }
                        setPickupSlots(next)
                      }}
                    />
                  </label>
                  <div className="md:col-span-12 flex justify-end">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                      disabled={pickupSlots.length <= 1}
                      onClick={() => setPickupSlots((s) => s.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-2xl bg-[#2b0f10] py-4 font-black !text-white disabled:opacity-60"
            >
              {createMutation.isPending ? (editingId ? "Saving..." : "Creating…") : (editingId ? "Save changes" : "Publish meal plan")}
            </button>
          </form>
        </div>
      )}
    </MotionPage>
  )
}
