const stats = [
  { value: "425k+", label: "MEMBERS" },
  { value: "30k+", label: "CLASSES" },
  { value: "9k+", label: "TEACHERS" },
  { value: "4.8★★★★★", label: "APP STORE RATING" },
]

export default function HomeStatsStrip() {
  return (
    <section className="bg-black py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 px-6 py-5 text-center text-white ring-1 ring-white/10">
              <div className="text-2xl font-black tracking-tight">{s.value}</div>
              <div className="mt-1 text-[11px] font-semibold tracking-[0.16em] text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

