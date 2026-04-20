import { Check, Shield, Zap, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { subscriptionPlans } from "../data/mock"
import MotionPage from "../components/MotionPage"

export default function Subscribe() {
  return (
    <MotionPage>
      <div className="space-y-8">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-8 sm:p-10 relative">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
            <Zap className="h-4 w-4" /> Subscription
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#1f1308]">Lock in a plan and stay consistent.</h1>
          <p className="mt-4 text-lg text-[#614937] max-w-2xl">
            Choose a plan that fits your routine. Locked prices, flexible slots, and neighborhood coverage.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {subscriptionPlans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={[
                "rounded-[2.5rem] p-10 relative overflow-hidden transition-all",
                index === 1 ? "hero-gradient text-white shadow-2xl shadow-orange-200/70 scale-105 z-10" : "soft-card text-[#1f1308]",
              ].join(" ")}
            >
              {index === 1 && (
                <div className="absolute top-6 right-6 rounded-full bg-white/20 px-4 py-1 text-xs font-black uppercase tracking-widest backdrop-blur-md">
                   Most Popular
                </div>
              )}
              <p className="text-sm font-black uppercase tracking-[0.24em] opacity-80">{plan.name}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-lg opacity-60 font-bold">/month</span>
              </div>
              <p className={index === 1 ? "mt-6 text-white/80 font-medium leading-relaxed" : "mt-6 text-[#614937] font-medium leading-relaxed"}>
                {plan.description}
              </p>
              
              <ul className="mt-10 space-y-4">
                 {['Free delivery', 'Customizable slots', 'Cancel anytime', 'Priority support'].map((feat) => (
                   <li key={feat} className="flex items-center gap-3 font-bold text-sm">
                      <div className={`rounded-full p-1 ${index === 1 ? 'bg-white/20 text-white' : 'bg-orange-100 text-[#a45100]'}`}>
                         <Check className="h-3 w-3" />
                      </div>
                      {feat}
                   </li>
                 ))}
              </ul>

              <button
                className={[
                  "mt-12 w-full rounded-2xl px-6 py-4 font-black transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg",
                  index === 1 ? "bg-white text-[#1f1308]" : "bg-[#1f1308] text-white",
                ].join(" ")}
              >
                Select plan <ArrowRight className="h-4 w-4" />
              </button>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="soft-card rounded-[2.5rem] p-10">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-[#1f1308]">Pickup snapshot</h2>
               <button className="text-sm font-bold text-[#b85e00] hover:underline">Change slots</button>
             </div>
            <div className="mt-4 space-y-4">
              {[
                ["College Gate", "7:00 PM", "Evening slot"],
                ["Home Kitchen", "1:15 PM", "Lunch slot"],
                ["Sector 4 Entrance", "8:15 PM", "Night slot"],
              ].map(([loc, time, type]) => (
                <div key={loc} className="flex items-center justify-between rounded-2xl bg-white/70 px-6 py-5 text-[#5d4534] border border-orange-50 hover:bg-white transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-[#1f1308] group-hover:text-white transition-colors">
                        <MapPin className="h-5 w-5" />
                     </div>
                     <div>
                       <p className="font-black text-[#1f1308]">{loc}</p>
                       <p className="text-xs font-bold text-[#8f6f55]">{type}</p>
                     </div>
                  </div>
                  <span className="text-xl font-black text-[#1f1308]">{time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-gradient rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Cart Review</p>
            <h2 className="mt-4 text-3xl font-black">Subscription summary</h2>
            <div className="mt-8 space-y-4 font-bold text-lg">
              <div className="flex justify-between border-b border-white/20 pb-4">
                 <span className="opacity-70 font-medium">Meal plan</span>
                 <span>Popular</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-4">
                 <span className="opacity-70 font-medium">Monthly cost</span>
                 <span>₹1,499</span>
              </div>
              <div className="flex justify-between pt-4">
                 <span className="text-2xl">Total</span>
                 <span className="text-2xl">₹1,499</span>
              </div>
            </div>
            <button className="mt-12 w-full rounded-2xl bg-white px-6 py-5 font-black text-[#1f1308] shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
              Confirm & Pay
            </button>
            <p className="mt-6 text-center text-xs font-bold opacity-60 flex items-center justify-center gap-2">
               <Shield className="h-4 w-4" /> Secure payment with Cashfree
            </p>
          </div>
        </section>
      </div>
    </MotionPage>
  )
}

function MapPin(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
