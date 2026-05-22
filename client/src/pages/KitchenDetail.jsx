import { useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MapPin, Star, Loader2, ArrowLeft, MessageSquare } from "lucide-react"
import { discoverService } from "../services/discoverService"
import { reviewService } from "../services/reviewService"
import MotionPage from "../components/MotionPage"
import useAuthStore from "../store/authStore"
import useToastStore from "../store/toastStore"
import { getApiErrorMessage } from "../api/axios"

export default function KitchenDetail() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const inApp = pathname.startsWith("/app")
  const user = useAuthStore((s) => s.user)
  const addToast = useToastStore((s) => s.addToast)
  const qc = useQueryClient()

  const { data: cook, isLoading, error } = useQuery({
    queryKey: ["cook", id],
    queryFn: () => discoverService.getCookDetails(id),
    enabled: !!id,
  })

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewService.listForCook(id),
    enabled: !!id,
  })

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const reviewMutation = useMutation({
    mutationFn: () =>
      reviewService.create({
        cookId: id,
        rating,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", id] })
      setComment("")
      addToast("Thanks for your review!", "success")
    },
    onError: (e) => addToast(getApiErrorMessage(e, "Could not submit review"), "error"),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error || !cook) {
    return (
      <MotionPage>
        <p className="text-center font-bold text-red-600">{getApiErrorMessage(error, "Kitchen not found")}</p>
        <Link to={discoverPath} className="mt-4 block text-center font-bold text-[#b85e00]">
          Back to discover
        </Link>
      </MotionPage>
    )
  }

  const subscribeUrl = (planId) =>
    user?.role === "consumer"
      ? `/app/subscribe?cookId=${cook.id}&mealPlanId=${planId}`
      : `/login?next=${encodeURIComponent(`/cooks/${cook.id}`)}`
  const discoverPath = inApp ? "/app/discover" : "/discover"

  return (
    <MotionPage>
      <div className="space-y-8">
        <Link
          to={discoverPath}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#705743] hover:text-[#1f1308]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <section className="glass-panel rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {cook.kitchenImage && (
              <img src={cook.kitchenImage} alt="Kitchen" className="h-24 w-24 sm:h-32 sm:w-32 rounded-[2rem] object-cover shadow-xl border-4 border-white/50 shrink-0" />
            )}
            <div>
              <h1 className="text-4xl font-black text-[#1f1308]">{cook.kitchenName}</h1>
              <p className="mt-2 text-lg font-bold text-[#6f5540]">{cook.user?.name}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[#705743]">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {cook.address ? `${cook.address}${cook.city ? `, ${cook.city}` : ''}` : (cook.city || "Neighborhood")}
                </p>
                {cook.phone && (
                  <p className="flex items-center gap-2 text-[#1f1308] font-bold bg-white/50 px-3 py-1 rounded-lg">
                    📞 {cook.phone}
                  </p>
                )}
                {(cook.latitude && cook.longitude) && (
                  <a href={`https://maps.google.com/?q=${cook.latitude},${cook.longitude}`} target="_blank" rel="noreferrer" className="text-xs underline text-blue-700 hover:text-blue-900">
                    View on Map
                  </a>
                )}
              </div>
              {cook.bio && <p className="mt-6 max-w-3xl text-[#614937] leading-relaxed">{cook.bio}</p>}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black text-[#1f1308]">Meal plans</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {(cook.mealPlans || []).map((plan) => (
              <article key={plan.id} className="soft-card rounded-[2rem] p-8">
                <h3 className="text-xl font-black">{plan.title}</h3>
                <p className="mt-2 text-[#614937]">{plan.description}</p>
                <p className="mt-4 text-2xl font-black text-[#a45100]">
                  ₹{plan.basePrice}
                  <span className="text-sm font-bold text-[#8f6f55]"> / day base</span>
                </p>
                <Link
                  to={subscribeUrl(plan.id)}
                  className="mt-6 inline-flex rounded-2xl bg-[#1f1308] px-6 py-3 font-black !text-white shadow-lg transition hover:bg-[#9a4b00]"
                >
                  Subscribe
                </Link>
              </article>
            ))}
          </div>
          {(cook.mealPlans || []).length === 0 && (
            <p className="text-[#705743]">This kitchen has no active plans yet.</p>
          )}
        </section>

        <section className="soft-card rounded-[2.5rem] p-8">
          <h2 className="text-2xl font-black text-[#1f1308] flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" /> Reviews
          </h2>
          <ul className="mt-6 space-y-4">
            {(reviews || []).map((r) => (
              <li key={r.id} className="rounded-2xl border border-orange-50 bg-white/80 px-5 py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black">{r.user?.name || "Neighbor"}</span>
                  <span className="text-amber-600 font-black">{r.rating}★</span>
                </div>
                {r.comment && <p className="mt-2 text-sm text-[#614937]">{r.comment}</p>}
              </li>
            ))}
          </ul>
          {(reviews || []).length === 0 && <p className="text-[#705743]">No reviews yet.</p>}

          {user?.role === "consumer" && (
            <form
              className="mt-8 space-y-4 border-t border-orange-100 pt-8"
              onSubmit={(ev) => {
                ev.preventDefault()
                reviewMutation.mutate()
              }}
            >
              <p className="font-black text-[#1f1308] flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Leave a review
              </p>
              <label className="block text-sm font-bold text-[#4f392a]">
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-bold text-[#4f392a]">
                Comment (optional)
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3"
                  rows={3}
                />
              </label>
              <button
                type="submit"
                disabled={reviewMutation.isPending}
                className="rounded-2xl bg-[#1f1308] px-6 py-3 font-black text-white disabled:opacity-60"
              >
                Submit review
              </button>
            </form>
          )}
        </section>
      </div>
    </MotionPage>
  )
}
