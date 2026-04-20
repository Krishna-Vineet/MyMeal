import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingBag, Users, Clock, ArrowRight, Star, MapPin, Zap } from "lucide-react"
import { featureCards, heroStats, howItWorks, meals } from "../data/mock"
import MotionPage from "../components/MotionPage"

export default function Home() {
  return (
    <MotionPage>
      <div className="space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel overflow-hidden rounded-4xl p-8 sm:p-10"
          >
            <div className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-[#9a4b00]">
              <Zap className="mr-2 h-4 w-4" /> Home-cooked meals, pickup slots
            </div>
            <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight text-[#1f1308] sm:text-5xl">
              MyMeal helps cooks and consumers build a calmer food routine.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[#614937] text-balance">
              Browse neighborhood cooks, choose a pickup time, and manage one-time meals or subscriptions in one warm marketplace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/app/discover" className="flex items-center gap-2 rounded-full hero-gradient px-8 py-4 font-bold text-white shadow-lg shadow-orange-200/70 transition hover:-translate-y-1">
                Explore meals <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/register" className="rounded-full border border-orange-200 bg-white px-8 py-4 font-bold text-[#7a4c18] transition hover:bg-orange-50">
                Create account
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat, i) => (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="soft-card rounded-3xl p-4"
                >
                  <p className="text-2xl font-black text-[#1f1308]">{stat.value}</p>
                  <p className="mt-1 text-sm text-[#6f5540]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="hero-gradient group relative overflow-hidden rounded-4xl p-8 text-white shadow-2xl shadow-orange-200/60 transition-all hover:scale-[1.02]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all"></div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80 flex items-center gap-2">
                <Star className="h-4 w-4 fill-white text-white" /> Today’s spotlight
              </p>
              <h2 className="mt-4 text-3xl font-black">Dinner Thali</h2>
              <p className="mt-2 text-lg text-white/80">College Gate at 7:00 PM or Home Kitchen at 8:15 PM.</p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm font-bold">
                <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">
                  <p className="text-white/70">Calories</p>
                  <p className="mt-1 text-2xl font-black">610 kcal</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">
                  <p className="text-white/70">Rating</p>
                  <p className="mt-1 text-2xl font-black">4.8 / 5</p>
                </div>
              </div>
            </div>

            <div className="soft-card rounded-4xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6f55] flex items-center gap-2">
                <Clock className="h-4 w-4" /> Quick flow
              </p>
              <ol className="mt-6 space-y-4">
                {howItWorks.map((step, index) => (
                  <motion.li 
                    key={step} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f1308] text-sm font-bold text-white shadow-lg">
                      {index + 1}
                    </span>
                    <p className="pt-2 text-lg font-medium text-[#563f2e]">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature, i) => (
            <motion.article 
              key={feature.title} 
              whileHover={{ y: -5 }}
              className="soft-card rounded-3xl p-8 transition-shadow hover:shadow-xl group"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#9a4b00] group-hover:bg-[#1f1308] group-hover:text-white transition-colors">
                {i === 0 ? <Users /> : i === 1 ? <Zap /> : <MapPin />}
              </div>
              <h3 className="text-2xl font-black text-[#1f1308]">{feature.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-[#614937]">{feature.description}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="soft-card relative overflow-hidden rounded-4xl p-10">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"></div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6f55]">How it feels</p>
            <h2 className="mt-4 text-3xl font-black text-[#1f1308]">Built for real pickup routines</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#614937]">
              MyMeal keeps the important pieces together: location, time, meal components, order tracking, and subscription snapshots.
            </p>
            <div className="mt-10 space-y-4">
              {[
                "Location + time pickup slots",
                "Meal component snapshots for subscriptions",
                "Consumer and cook dashboards",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/70 px-6 py-4 font-bold text-[#513b2b] shadow-sm border border-orange-50">
                  <CheckCircle className="h-5 w-5 text-green-600" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="soft-card rounded-4xl p-8">
            <div className="flex items-center justify-between mb-8">
               <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6f55]">Popular meals</p>
               <Link to="/app/discover" className="text-sm font-bold text-[#9a4b00] hover:underline">View all</Link>
            </div>
            <div className="grid gap-4">
              {meals.map((meal) => (
                <article key={meal.name} className="group relative rounded-3xl border border-orange-100 bg-white/90 p-6 transition-all hover:border-orange-300 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1f1308] group-hover:text-[#9a4b00] transition-colors">{meal.name}</h3>
                      <p className="mt-1 font-medium text-[#6f5540] flex items-center gap-1">
                        <Users className="h-3 w-3" /> {meal.cook}
                      </p>
                    </div>
                    <span className="rounded-2xl bg-orange-100 px-4 py-2 text-lg font-black text-[#a45100]">
                      {meal.price}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#705743]">
                    <MapPin className="h-4 w-4" /> {meal.location}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MotionPage>
  )
}

function CheckCircle(props) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
