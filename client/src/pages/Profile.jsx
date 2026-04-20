export default function Profile() {
  return (
    <div className="space-y-6">
      <section className="hero-gradient rounded-[2rem] p-8 text-white shadow-2xl shadow-rose-200/60">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Cook profile</p>
        <h1 className="mt-3 text-4xl font-black">Asha Verma</h1>
        <p className="mt-3 max-w-2xl text-white/80">
          Preparing homestyle North Indian meals, subscription plans, and organized pickup slots for nearby
          consumers.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["3", "Meal plans"],
          ["12", "Pickup slots"],
          ["48", "Active subscribers"],
        ].map(([value, label]) => (
          <article key={label} className="soft-card rounded-[2rem] p-6">
            <p className="text-3xl font-black text-[#1f1308]">{value}</p>
            <p className="mt-1 text-sm text-[#705743]">{label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="soft-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-black text-[#1f1308]">Kitchen highlights</h2>
          <div className="mt-4 space-y-3 text-sm text-[#705743]">
            <p>Speciality: thali, roti, dal, paneer, and seasonal sides.</p>
            <p>Coverage: Hinjewadi, Baner, and Aundh.</p>
            <p>Average rating: 4.9 / 5.</p>
          </div>
        </div>
        <div className="soft-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-black text-[#1f1308]">Today’s workflow</h2>
          <div className="mt-4 space-y-3">
            {["Prepare lunch components", "Confirm 7 PM pickup slot", "Review order notes"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/80 px-4 py-3 text-[#5d4534]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
