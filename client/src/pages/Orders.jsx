import { ShoppingBag, Clock, MapPin, CheckCircle2, Package, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { orderService } from "../services/orderService"
import useAuthStore from "../store/authStore"
import MotionPage from "../components/MotionPage"

export default function Orders() {
  const user = useAuthStore((state) => state.user)
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders", user?.role],
    queryFn: () => user?.role === 'cook' ? orderService.getOrdersForCook() : orderService.getOrdersForConsumer(),
    enabled: !!user
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
        <p className="text-lg font-bold text-red-500 tracking-tight">Failed to load orders</p>
        <button onClick={() => window.location.reload()} className="rounded-xl bg-orange-100 px-6 py-2 font-bold text-orange-600">Retry</button>
      </div>
    )
  }

  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-8 sm:p-10 relative">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> My Orders
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Track your daily meal routine.</h1>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {orders?.map((order, i) => (
            <motion.article 
              key={order.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="soft-card rounded-[2.5rem] p-8 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-orange-100"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#8f6f55]">#{order.id.toString().slice(-6)}</p>
                    <h2 className="mt-2 text-2xl font-black text-[#1f1308]">{order.mealPlan?.title || "Meal Plan"}</h2>
                  </div>
                  <span className={`rounded-2xl px-4 py-2 text-sm font-black uppercase tracking-widest ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-[#a45100]'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-[#705743]">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                       <Clock className="h-4 w-4" />
                    </div>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[#705743]">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                       <MapPin className="h-4 w-4" />
                    </div>
                    {order.pickupSlot?.location || "Pickup Slot"}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-xs font-black uppercase tracking-widest text-[#8f6f55]">Progress</span>
                   <span className="text-xs font-black text-[#1f1308]">{order.status === 'delivered' ? '100%' : '70%'}</span>
                </div>
                <div className="h-3 rounded-full bg-orange-50 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: order.status === 'delivered' ? '100%' : '70%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-[#1f1308]'}`} 
                  />
                </div>
                
                <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white border border-orange-100 py-4 font-black text-[#1f1308] transition-all hover:bg-orange-50 active:scale-95">
                   Order details <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </section>

        {orders?.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center opacity-50">
             <ShoppingBag className="h-12 w-12 mb-4" />
             <p className="text-xl font-bold">No orders found yet.</p>
          </div>
        )}
      </div>
    </MotionPage>
  )
}
