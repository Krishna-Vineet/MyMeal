import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8f6f55]">404</p>
      <h1 className="mt-4 text-4xl font-black text-[#1f1308]">This meal route is not on the menu.</h1>
      <p className="mt-4 text-[#614937]">
        The page you requested does not exist, but the main MyMeal experience is only a click away.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full hero-gradient px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200/70"
      >
        Back to home
      </Link>
    </div>
  )
}
