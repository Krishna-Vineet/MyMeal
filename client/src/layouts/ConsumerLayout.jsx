import { Link, NavLink, Outlet } from "react-router-dom"
import useAuthStore from "../store/authStore"

const links = [
  { to: "/app/discover", label: "Discover" },
  { to: "/app/cooks", label: "Cooks" },
  { to: "/app/subscribe", label: "Subscribe" },
  { to: "/app/orders", label: "Orders" },
  { to: "/app/settings", label: "Settings" },
]

const linkClass = ({ isActive }) =>
  [
    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
    isActive ? "bg-[#1f1308] text-white shadow-lg shadow-orange-200/60" : "text-[#5c4835] hover:bg-white/80",
  ].join(" ")

export default function ConsumerLayout() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/70 bg-white/60 p-6 backdrop-blur-xl lg:flex lg:flex-col">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl hero-gradient text-lg font-black text-white shadow-lg shadow-orange-200/70">
            M
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a5b2e]">MyMeal</p>
            <p className="text-xs text-[#8f6f55]">Consumer dashboard</p>
          </div>
        </Link>

        <div className="soft-card mb-6 rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6f55]">Welcome back</p>
          <p className="mt-2 text-lg font-semibold text-[#1f1308]">{user?.name ?? "Guest"}</p>
          <p className="text-sm text-[#6f5540]">{user?.role ?? "consumer"} account</p>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-[#1f1308] p-5 text-white shadow-2xl shadow-orange-200/60">
          <p className="text-sm font-semibold text-orange-200">Today’s pickup</p>
          <p className="mt-2 text-2xl font-black">7:00 PM</p>
          <p className="mt-2 text-sm text-white/75">College Gate slot is ready for your next order.</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-white/70 bg-white/65 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6f55]">Consumer mode</p>
              <h1 className="text-xl font-black text-[#1f1308]">Browse, subscribe, and track meals</h1>
            </div>
            <Link to="/app/settings" className="rounded-full bg-[#1f1308] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200/60 transition hover:-translate-y-0.5">
              Settings
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <nav className="sticky bottom-0 z-20 border-t border-white/70 bg-white/80 px-3 py-3 backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-5 gap-2">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
