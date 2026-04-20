import { Users, Star, MapPin, ArrowRight, ChefHat, Calendar, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { discoverService } from "../services/discoverService"
import MotionPage from "../components/MotionPage"

export default function Cooks() {
  const { data: cooks, isLoading, error } = useQuery({
    queryKey: ["cooks"],
    queryFn: () => discoverService.getCooks()
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-bold text-red-500 tracking-tight">Failed to load local cooks</p>
        <button onClick={() => window.location.reload()} className="rounded-xl bg-rose-50 px-6 py-2 font-bold text-rose-600">Retry</button>
      </div>
    )
  }

  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-8 sm:p-10 relative">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-100/50 blur-3xl"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <ChefHat className="h-4 w-4" /> Community
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Browse cooks with neighborhood coverage.</h1>
          <p className="mt-4 text-lg text-[#614937] max-w-2xl">
            Meet the talented home chefs providing fresh, healthy, and authentic meals in your area.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {cooks?.map((cook, i) => (
            <motion.article 
              key={cook.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="soft-card group rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-rose-100"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center text-[#9d2b2b] group-hover:bg-[#1f1308] group-hover:text-white transition-colors">
                  <ChefHat className="h-8 w-8" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-rose-50 px-4 py-2 font-black text-[#9d2b2b]">
                   <Star className="h-4 w-4 fill-[#9d2b2b]" /> 4.9
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-black text-[#1f1308] group-hover:text-[#9d2b2b] transition-colors">{cook.kitchenName}</h2>
                <p className="mt-2 font-bold text-[#6f5540] italic">"{cook.user?.name || "Independent Chef"}"</p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-[#705743]">
                  <span className="flex items-center gap-2 italic"><MapPin className="h-4 w-4" /> {cook.area || "Nearby"}</span>
                  <span className="flex items-center gap-2 text-[#9d2b2b]"><Calendar className="h-4 w-4" /> Available Daily</span>
                </div>
              </div>
              
              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1f1308] px-6 py-4 font-black text-white shadow-lg transition-all hover:bg-[#9d2b2b] active:scale-95">
                View kitchen <ArrowRight className="h-4 w-4" />
              </button>
            </motion.article>
          ))}
        </section>

        {cooks?.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center opacity-50">
             <ChefHat className="h-12 w-12 mb-4" />
             <p className="text-xl font-bold">No chefs available in this neighborhood yet.</p>
          </div>
        )}
      </div>
    </MotionPage>
  )
}
