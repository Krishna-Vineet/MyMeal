import { Search, MapPin, Star, Filter, ArrowRight, Zap, Clock, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { discoverService } from "../services/discoverService"
import MotionPage from "../components/MotionPage"

export default function Discover() {
  const { data: cooks, isLoading, error } = useQuery({
    queryKey: ["cooks"],
    queryFn: () => discoverService.getCooks()
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
        <p className="text-lg font-bold text-red-500 tracking-tight">Failed to load marketplace</p>
        <button onClick={() => window.location.reload()} className="rounded-xl bg-orange-100 px-6 py-2 font-bold text-orange-600">Retry</button>
      </div>
    )
  }

  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <Search className="h-4 w-4" /> Marketplace
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Discover home kitchens near you.</h1>
          
          <div className="mt-8 grid gap-4 md:grid-cols-[1.5fr_repeat(3,1fr)]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f6f55]" />
              <input
                type="text"
                placeholder="Search kitchen name or area..."
                className="w-full rounded-[1.25rem] border border-orange-100 bg-white pl-12 pr-4 py-4 outline-none transition-all focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100 font-medium"
              />
            </div>
            {["Within 3 km", "Under ₹200", "Top Rated"].map((pill) => (
              <button
                key={pill}
                type="button"
                className="flex items-center justify-center gap-2 rounded-[1.25rem] border border-orange-100 bg-white px-4 py-4 text-sm font-bold text-[#654a36] transition-all hover:bg-orange-50 hover:border-orange-300 active:scale-95"
              >
                <Filter className="h-4 w-4" /> {pill}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {cooks?.map((cook, i) => (
            <motion.article 
              key={cook.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="soft-card group rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-orange-200/40 relative"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-[#1f1308] group-hover:text-[#9a4b00] transition-colors">{cook.kitchenName}</h2>
                  <p className="mt-2 flex items-center gap-2 font-bold text-[#6f5540]">
                    <Zap className="h-4 w-4 text-orange-500" /> {cook.user?.name || "Home Chef"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-orange-100 px-5 py-3 text-xl font-black text-[#a45100] shadow-sm shadow-orange-200">
                  {cook.isAcceptingOrders ? "Open" : "Closed"}
                </div>
              </div>
              
              <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#705743]">
                <MapPin className="h-4 w-4 text-[#8f6f55]" /> {cook.area || "Neighborhood"}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {['Homestyle', 'Fresh', 'Pickup'].map((tag) => (
                  <span key={tag} className="rounded-full bg-orange-50 px-4 py-1 text-xs font-bold text-[#704f37] border border-orange-100">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-10 flex items-center justify-between border-t border-orange-100 pt-6">
                <div className="flex items-center gap-1">
                   <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                   <span className="text-lg font-black text-[#1f1308]">4.9</span>
                </div>
                <button className="flex items-center gap-2 rounded-2xl bg-[#1f1308] px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#9a4b00] active:scale-95">
                  View Kitchen <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </section>

        {cooks?.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center opacity-50">
            <MapPin className="h-12 w-12 mb-4" />
            <p className="text-xl font-bold">No kitchens found in this area yet.</p>
            <p>Try searching for a different area or removing filters.</p>
          </div>
        )}
      </div>
    </MotionPage>
  )
}
