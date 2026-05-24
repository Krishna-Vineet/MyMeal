import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Shield, Zap, Loader2 } from "lucide-react"
import { discoverService } from "../services/discoverService"
import { subscriptionService } from "../services/subscriptionService"
import { paymentService } from "../services/paymentService"
import MotionPage from "../components/MotionPage"
import useToastStore from "../store/toastStore"
import { getApiErrorMessage } from "../api/axios"

function todayISODate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function Subscribe() {
  const [params] = useSearchParams()
  const cookId = params.get("cookId")
  const mealPlanId = params.get("mealPlanId")

  const addToast = useToastStore((s) => s.addToast)
  const qc = useQueryClient()

  const [startDate, setStartDate] = useState(todayISODate())
  const [duration, setDuration] = useState("1_month")
  const [pickupSlotId, setPickupSlotId] = useState("")
  const [totalPerDay, setTotalPerDay] = useState(0)
  const [advancePayment, setAdvancePayment] = useState(0)
  const [totalSubscriptionPrice, setTotalSubscriptionPrice] = useState()

  const { data: cook, isLoading: cookLoading } = useQuery({
    queryKey: ["cook", cookId],
    queryFn: () => discoverService.getCookDetails(cookId),
    enabled: !!cookId,
  })

  const plan = useMemo(
    () => cook?.mealPlans?.find((p) => p.id === mealPlanId),
    [cook, mealPlanId],
  )

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionService.getSubscriptions(),
  })

  const createMutation = useMutation({
    mutationFn: (payload) => subscriptionService.createSubscription(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["subscriptions"] })
      qc.invalidateQueries({ queryKey: ["orders"] })
      addToast(data?.message || "Subscribed!", "success")
    },
    onError: (e) => {
      const msg = getApiErrorMessage(e, "Could not subscribe")
      addToast(msg, "error")
    },
  })

  const payMutation = useMutation({
    mutationFn: ({ subscriptionId, amount }) =>
      paymentService.recordPayment({
        subscriptionId,
        amount,
        method: "mock_wallet",
        type: "topup",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscriptions"] })
      addToast("Payment recorded", "success")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Payment failed"), "error"),
  })

  const [selectedComponents, setSelectedComponents] = useState({})

  // Compute totalPerDayPrice automatically
  useMemo(() => {
    setTotalPerDay(plan?.basePrice + Object.entries(selectedComponents)
      .filter(([_, v]) => v.enabled)
      .reduce((acc, [id, v]) => {
          const mc = plan.mealComponents?.find(m => m.id === id)
          if (!mc) return acc
          
          let itemExtraPrice = 0
          if (mc.isToggle) {
            // For toggle items, price scales with selected quantity
            itemExtraPrice = (v.quantity || 0) * (mc.price || 0)
          } else {
            const extraQty = v.quantity - (mc.defaultQuantity || 0)
            if (extraQty > 0) itemExtraPrice = extraQty * (mc.price || 0)
          }
          return acc + itemExtraPrice
      }, 0))
  }, [plan, selectedComponents])

  // compute total subscription price
  const activeDays = useMemo(() => {
    if (!plan || !startDate || !duration) return 0
    
    const start = new Date(startDate)
    let endDate = new Date(start)
    
    if (duration === "1_week") endDate.setDate(start.getDate() + 7 - 1)
    else if (duration === "2_week") endDate.setDate(start.getDate() + 14 - 1)
    else if (duration === "1_month") {
        endDate.setMonth(start.getMonth() + 1)
        endDate.setDate(endDate.getDate() - 1)
    }
    else if (duration === "2_month") {
        endDate.setMonth(start.getMonth() + 2)
        endDate.setDate(endDate.getDate() - 1)
    }
    else if (duration === "3_month") {
        endDate.setMonth(start.getMonth() + 3)
        endDate.setDate(endDate.getDate() - 1)
    }

    let count = 0
    let current = new Date(start)
    while (current <= endDate) {
        const day = current.getDay() // 0 = Sun, 6 = Sat
        const weekday = day === 0 ? 7 : day // 1-7 (Mon-Sun)
        
        if (plan.validityType === "all_days") {
            count++
        } else if (plan.validityType === "weekdays" && weekday <= 5) {
            count++
        } else if (plan.validityType === "weekends" && weekday >= 6) {
            count++
        }
        current.setDate(current.getDate() + 1)
    }
    return count
  }, [plan?.validityType, startDate, duration])

  useEffect(() => {
    const total = totalPerDay * activeDays
    setTotalSubscriptionPrice(total)
    // Set advance payment to 10% by default
    setAdvancePayment(Math.ceil(total * 0.1))
  }, [totalPerDay, activeDays])

  // Initialize components when plan loads
  useMemo(() => {
    if (plan?.mealComponents) {
        const initial = {}
        plan.mealComponents.forEach(mc => {
            initial[mc.id] = {
                enabled: true,
                quantity: mc.defaultQuantity || 1
            }
        })
        setSelectedComponents(initial)
    }
  }, [plan])

  const handleSubscribe = (ev) => {
    ev.preventDefault()
    if (!plan || !pickupSlotId) {
      addToast("Pick a pickup slot", "error")
      return
    }
    
    const componentsPayload = Object.entries(selectedComponents)
        .filter(([_, val]) => val.enabled)
        .map(([id, val]) => ({
            mealComponentId: id,
            quantity: val.quantity,
            enabled: true
        }))

    createMutation.mutate({
      mealPlanId: plan.id,
      pickupSlotId,
      startDate,
      duration,
      advancePayment: Number(advancePayment) || 0,
      components: componentsPayload,
    })
  }

  const wizardActive = !!(cookId && mealPlanId)

  if (wizardActive && cookLoading) {
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
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <Zap className="h-4 w-4" /> Subscription
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Plans & billing.</h1>
          <p className="mt-4 text-lg text-[#614937] max-w-2xl">
            Subscribe from a kitchen detail page, or manage existing subscriptions below.
          </p>
        </section>

        {!wizardActive && (
          <section className="soft-card rounded-[2.5rem] p-8">
            <h2 className="text-xl font-black text-[#1f1308]">Your subscriptions</h2>
            {subsLoading ? (
              <Loader2 className="mt-6 h-8 w-8 animate-spin text-orange-500" />
            ) : (
              <ul className="mt-6 space-y-4">
                {(subscriptions || []).map((sub) => (
                  <li key={sub.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-50 bg-white/80 px-5 py-4">
                    <div>
                      <p className="font-black">{sub.mealPlan?.title || "Plan"}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#8f6f55]">{sub.status}</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl bg-orange-100 px-4 py-2 text-sm font-black text-orange-800"
                      onClick={() =>
                        payMutation.mutate({
                          subscriptionId: sub.id,
                          amount: 200,
                        })
                      }
                      disabled={payMutation.isPending}
                    >
                      Pay ₹200 (demo top-up)
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {(subscriptions || []).length === 0 && !subsLoading && (
              <p className="mt-4 text-[#705743]">
                No subscriptions yet.{" "}
                <Link className="font-black text-[#b85e00] underline" to="/app/discover">
                  Discover kitchens
                </Link>
              </p>
            )}
          </section>
        )}

        {wizardActive && plan && (
          <form
            onSubmit={handleSubscribe}
            className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div className="soft-card rounded-[2.5rem] p-10 space-y-6">
              {plan.bannerImage && (
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-orange-50">
                    <img src={plan.bannerImage} alt={plan.title} className="h-full w-full object-cover" />
                </div>
              )}
              <h2 className="text-2xl font-black text-[#1f1308]">{plan.title}</h2>
              <p className="text-[#614937]">{plan.description}</p>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#4f392a] uppercase tracking-widest">Customize your plan</p>
                {(plan.mealComponents || []).map((mc) => {
                    const state = selectedComponents[mc.id] || { enabled: false, quantity: 0 }
                    return (
                        <div key={mc.id} className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${state.enabled ? 'border-orange-200 bg-orange-50/50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={state.enabled} 
                                    onChange={(e) => setSelectedComponents(prev => ({
                                        ...prev,
                                        [mc.id]: { ...prev[mc.id], enabled: e.target.checked }
                                    }))}
                                    className="h-5 w-5 rounded-lg accent-orange-600"
                                />
                                <div>
                                    <p className="font-bold text-[#2b0f10]">{mc.name}</p>
                                    <p className="text-xs font-black text-orange-700">₹{mc.price} / item</p>
                                    <p className="mt-2 text-sm text-[#614937]">
                  Validity: {plan.validityType === "all_days" ? "All days" : plan.validityType === "weekdays" ? "Weekdays only" : plan.validityType === "weekends" ? "Weekends only" : ""}
                </p>                </div>
                            </div>
                            {state.enabled && (
                                <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-1 shadow-sm border border-orange-100">
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedComponents(prev => ({
                                            ...prev,
                                            [mc.id]: { ...prev[mc.id], quantity: Math.max(1, prev[mc.id].quantity - 1) }
                                        }))}
                                        className="text-orange-600 font-black p-1 hover:bg-orange-50 rounded-lg"
                                    >-</button>
                                    <span className="text-sm font-black min-w-[20px] text-center">{state.quantity}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedComponents(prev => ({
                                            ...prev,
                                            [mc.id]: { ...prev[mc.id], quantity: Math.min(mc.maxQuantity || 5, prev[mc.id].quantity + 1) }
                                        }))}
                                        className="text-orange-600 font-black p-1 hover:bg-orange-50 rounded-lg"
                                    >+</button>
                                </div>
                            )}
                        </div>
                    )
                })}
              </div>
              <label className="block text-sm font-bold text-[#4f392a]">
                Start date
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                />
              </label>
              <label className="block text-sm font-bold text-[#4f392a]">
                Duration
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                >
                  {(plan.availableDurations || ["1_month"]).map((d) => (
                    <option key={d} value={d}>
                      {d.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-bold text-[#4f392a]">
                Pickup slot
                <select
                  required
                  value={pickupSlotId}
                  onChange={(e) => setPickupSlotId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                >
                  <option value="">Choose slot</option>
                  {(plan.pickupSlots || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.locationName} · {s.pickupTime}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-bold text-[#4f392a]">
                Advance payment ({10 * Number(totalSubscriptionPrice) / 100}₹) — minimum 10% of total subscription amount is required
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={advancePayment}
                  onChange={(e) => setAdvancePayment(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                />
              </label>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full rounded-2xl bg-[#1f1308] py-4 font-black !text-white disabled:opacity-60"
              >
                {createMutation.isPending ? "Confirming…" : "Confirm subscription"}
              </button>
            </div>
            <div className="hero-gradient rounded-[2.5rem] p-10 !text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em] !text-white/70">Summary</p>
              <h2 className="mt-4 text-3xl font-black">Kitchen</h2>
              <p className="mt-2 font-bold">{cook?.kitchenName}</p>
              
              <div className="mt-8 space-y-4 text-sm font-bold">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="opacity-70">Base price / day</span>
                  <span>₹{plan.basePrice}</span>
                </div>
                <p className="mt-2 text-sm text-[#614937]">
                  Validity: {plan.validityType === "all_days" ? "All days" : plan.validityType === "weekdays" ? "Weekdays only" : plan.validityType === "weekends" ? "Weekends only" : ""}
                </p>
                {Object.entries(selectedComponents).filter(([_, v]) => v.enabled).map(([id, v]) => {
                    const mc = plan.mealComponents?.find(m => m.id === id)
                    if (!mc) return null
                    return (
                        <div key={id} className="flex justify-between border-b border-white/10 pb-2 text-white/80">
                            <span>{mc.name} (x{v.quantity})</span>
                            <span>₹{mc.price * v.quantity}</span>
                        </div>
                    )
                })}
                <div className="flex justify-between pt-4 text-lg">
                  <span>Total / day</span>
                  <span className="text-2xl font-black underline decoration-orange-400">
                    ₹{totalPerDay}
                  </span>
                </div>
                <div className="flex justify-between pt-4 text-sm opacity-80">
                  <span>Active delivery days</span>
                  <span>{activeDays} days</span>
                </div>
                <div className="flex justify-between pt-4 text-lg">
                  <span>Total subscription amount</span>
                  <span className="text-2xl font-black underline decoration-orange-400">
                    ₹{totalSubscriptionPrice}
                  </span>
                </div>
              </div>

              <p className="mt-8 flex items-center gap-2 text-xs font-bold opacity-70">
                <Shield className="h-4 w-4" /> Taxes included.
              </p>
            </div>
          </form>
        )}

        {wizardActive && !plan && !cookLoading && (
          <p className="text-center font-bold text-red-600">
            Could not find that meal plan.{" "}
            <Link to="/app/discover" className="text-[#b85e00] underline">
              Browse kitchens
            </Link>
          </p>
        )}
      </div>
    </MotionPage>
  )
}
