import { Link, NavLink, Outlet } from "react-router-dom"
import useAuthStore from "../store/authStore"

const navLinkClass = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-[#1f1308] text-white shadow-lg shadow-orange-200/60" : "text-[#5c4835] hover:bg-white/80",
  ].join(" ")

export default function PublicLayout() {
  const user = useAuthStore((state) => state.user)
  const appPath = user?.role === "cook" ? "/cook/profile" : "/app/orders"

  return (
    <div className="min-h-screen text-[#20160f]">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl hero-gradient text-lg font-black text-white shadow-lg shadow-orange-200/70">
              M
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a5b2e]">MyMeal</p>
              <p className="text-xs text-[#8f6f55]">Home-cooked food marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/discover" className={navLinkClass}>
              Discover
            </NavLink>
            <NavLink to="/cooks" className={navLinkClass}>
              Cooks
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to={appPath} className="rounded-full bg-[#1f1308] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200/60 transition hover:-translate-y-0.5">
                Open app
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[#4c3929] transition hover:bg-white/70"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-[#1f1308] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200/60 transition hover:-translate-y-0.5"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
