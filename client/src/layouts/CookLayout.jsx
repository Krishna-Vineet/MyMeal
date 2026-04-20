import { Link, NavLink, Outlet } from "react-router-dom"
import useAuthStore from "../store/authStore"

const links = [
  { to: "/cook/profile", label: "Profile" },
  { to: "/cook/orders", label: "Orders" },
  { to: "/cook/settings", label: "Settings" },
]

const linkClass = ({ isActive }) =>
  [
    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
    isActive ? "bg-[#2b0f10] text-white shadow-lg shadow-rose-200/60" : "text-[#5f4545] hover:bg-white/80",
  ].join(" ")

export default function CookLayout() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/70 bg-white/60 p-6 backdrop-blur-xl lg:flex lg:flex-col">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#d62828] to-[#f77f00] text-lg font-black text-white shadow-lg shadow-rose-200/60">
            M
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c4c4c]">MyMeal</p>
            <p className="text-xs text-[#8b6767]">Cook dashboard</p>
          </div>
        </Link>

        <div className="soft-card mb-6 rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b6767]">Kitchen profile</p>
          <p className="mt-2 text-lg font-semibold text-[#2b0f10]">{user?.name ?? "Cook account"}</p>
          <p className="text-sm text-[#6e5252]">{user?.role ?? "cook"} account</p>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-[#2b0f10] p-5 text-white shadow-2xl shadow-rose-200/60">
          <p className="text-sm font-semibold text-rose-200">Active subscriptions</p>
          <p className="mt-2 text-2xl font-black">48</p>
          <p className="mt-2 text-sm text-white/75">You have 12 pickup slots open for today.</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-white/70 bg-white/65 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b6767]">Cook mode</p>
              <h1 className="text-xl font-black text-[#2b0f10]">Manage meals, slots, and orders</h1>
            </div>
            <Link to="/cook/profile" className="rounded-full bg-[#2b0f10] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-200/60 transition hover:-translate-y-0.5">
              View kitchen
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <nav className="sticky bottom-0 z-20 border-t border-white/70 bg-white/80 px-3 py-3 backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-3 gap-2">
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
