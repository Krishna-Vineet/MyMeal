import { ShoppingBag, Clock, MapPin, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { orderService } from "../services/orderService"
import useAuthStore from "../store/authStore"
import MotionPage from "../components/MotionPage"
import { getApiErrorMessage } from "../api/axios"
import useToastStore from "../store/toastStore"

function formatDate(value) {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
}

function statusLabel(s) {
  const map = {
    scheduled: "Scheduled",
    prepared: "Prepared",
    picked_up: "Picked up",
    missed: "Missed",
    cancelled: "Cancelled",
  }
  return map[s] || s
}

function statusClass(s) {
  if (s === "picked_up") return "bg-green-100 text-green-800"
  if (s === "prepared") return "bg-amber-100 text-amber-800"
  if (s === "missed" || s === "cancelled") return "bg-red-50 text-red-700"
  return "bg-orange-100 text-[#a45100]"
}

export default function Orders() {
  const user = useAuthStore((state) => state.user)
  const addToast = useToastStore((s) => s.addToast)
  const qc = useQueryClient()

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders", user?.role],
    queryFn: () =>
      user?.role === "cook"
        ? orderService.getOrdersForCook()
        : orderService.getOrdersForConsumer(),
    enabled: !!user,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: ["orders"] })
      addToast(`Order ${statusLabel(status).toLowerCase()}`, "success")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not update order"), "error"),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-bold text-red-500 tracking-tight">
          {getApiErrorMessage(error, "Failed to load orders")}
        </p>
        <button
          type="button"
          onClick={() => qc.invalidateQueries({ queryKey: ["orders"] })}
          className="rounded-xl bg-orange-100 px-6 py-2 font-bold text-orange-600"
        >
          Retry
        </button>
      </div>
    )
  }

  const isCook = user?.role === "cook"

  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-8 sm:p-10 relative">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> {isCook ? "Kitchen orders" : "My orders"}
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">
            {isCook ? "Next 7 days on your calendar." : "Track your daily meal routine."}
          </h1>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {orders?.map((order, i) => {
            const title = order.mealPlan?.title || "Meal plan"
            const slotName = order.pickupSlot?.locationName || "Pickup"
            const dateStr = formatDate(order.displayDate || order.orderDate)
            const canPrep = isCook && order.status === "scheduled"
            const canPickup = isCook && order.status === "prepared"

            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="soft-card rounded-[2.5rem] p-8 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-orange-100"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {order._bucketDate && (
                        <p className="text-xs font-black uppercase tracking-widest text-[#8f6f55]">
                          {formatDate(order._bucketDate)}
                        </p>
                      )}
                      <p className="text-xs font-black uppercase tracking-widest text-[#8f6f55]">
                        #{String(order.id).slice(-8)}
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-[#1f1308]">{title}</h2>
                    </div>
                    <span className={`rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest ${statusClass(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-[#705743]">
                      <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <Clock className="h-4 w-4" />
                      </div>
                      {dateStr}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-[#705743]">
                      <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                      {slotName}
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-3">
                  {isCook && (canPrep || canPickup) && (
                    <div className="flex flex-wrap gap-2">
                      {canPrep && (
                        <button
                          type="button"
                          disabled={statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ id: order.id, status: "prepared" })}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1f1308] px-4 py-3 text-sm font-black !text-white transition-all hover:bg-[#9a4b00] active:scale-95 disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Prepared
                        </button>
                      )}
                      {canPickup && (
                        <button
                          type="button"
                          disabled={statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ id: order.id, status: "picked_up" })}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-green-600 px-4 py-3 text-sm font-black text-green-800 transition-all hover:bg-green-50 active:scale-95 disabled:opacity-60"
                        >
                          Picked up
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white border border-orange-100 py-4 font-black text-[#1f1308] transition-all hover:bg-orange-50 active:scale-95"
                  >
                    Details <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </section>

        {orders?.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center opacity-70">
            <ShoppingBag className="h-12 w-12 mb-4" />
            <p className="text-xl font-bold">No orders yet.</p>
            <p className="text-sm font-medium text-[#705743]">
              {isCook ? "New subscriptions will generate orders here." : "Subscribe to a kitchen to see orders."}
            </p>
          </div>
        )}
      </div>
    </MotionPage>
  )
}
