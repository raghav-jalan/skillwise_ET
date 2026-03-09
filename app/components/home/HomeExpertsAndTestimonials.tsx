const experts = [
  { name: "Lisa Bardot", role: "Illustrator", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { name: "Daniel Scott", role: "Digital Designer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Derek Elliot", role: "Animator, Product Designer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { name: "Aaron Draplin", role: "Graphic Designer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Zaneena Nabeel", role: "Watercolor Artist", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { name: "Emonee LaRussa", role: "Motion Graphics Artist", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
  { name: "Brent Eviston", role: "Master Artist", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Jordy Vandeput", role: "Filmmaker and YouTuber", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
]

const testimonials = [
  {
    name: "Rachel R",
    quote:
      "SkillUp was the best learning decision I've ever made... Real-world skills without the financial burden of traditional school.",
  },
  {
    name: "Katrina",
    quote:
      "It's rare that I subscribe for anything, but this is one subscription I can't imagine not having.",
  },
  {
    name: "Elli V",
    quote:
      "I love that SkillUp is a platform where I can find other learners and we can support each other on our learning journey.",
  },
  {
    name: "Savonne M",
    quote:
      "SkillUp helps me level up my skills, while also letting me explore. Teachers bring vibrant personalities and practical tips.",
  },
]

function ExpertCard({ name, role, idx, image }: { name: string; role: string; idx: number; image?: string }) {
  const tones = [
    "from-amber-200 via-amber-100 to-white",
    "from-slate-200 via-slate-100 to-white",
    "from-blue-200 via-blue-100 to-white",
    "from-emerald-200 via-emerald-100 to-white",
    "from-rose-200 via-rose-100 to-white",
    "from-purple-200 via-purple-100 to-white",
  ]
  const tone = tones[idx % tones.length]

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-black/10">
      {image ? (
        <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover object-top" />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${tone}`} />
          <div className="absolute inset-0 bg-black/25" />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="relative aspect-[4/5] w-full">
        <div className="absolute left-4 bottom-4 right-4">
          <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold tracking-wide text-white ring-1 ring-white/20">
            MEET
          </div>
          <div className="mt-2 text-2xl font-black leading-tight text-white drop-shadow">
            {name}
          </div>
          <div className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-white/85">{role.toUpperCase()}</div>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ name, quote }: { name: string; quote: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="py-2">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-black">
          {initials}
        </div>
        <span className="text-lg font-black text-gray-950">{name}</span>
      </div>
      <div className="mt-4 border-t border-gray-200" />
      <p className="mt-5 mx-auto max-w-[220px] text-center text-base font-bold leading-relaxed text-gray-800">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  )
}

export default function HomeExpertsAndTestimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">Learn from Creative Experts</h2>
          <p className="hidden max-w-md text-sm text-gray-600 md:block">
            SkillUp teachers are industry leaders excited to share their tools, techniques, and professional journeys with you.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {experts.map((e, idx) => (
            <ExpertCard key={e.name} name={e.name} role={e.role} idx={idx} image={e.image} />
          ))}
        </div>

        <h3 className="mt-20 text-center text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
          Why Students Love SkillUp
        </h3>

        <div className="mt-10 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} name={t.name} quote={t.quote} />
          ))}
        </div>
      </div>
    </section>
  )
}
