import { Flame, Sparkles, Users } from "lucide-react"

const items = [
  {
    icon: Sparkles,
    title: "Stay Inspired",
    desc: "Discover trending topics, get quick answers, and find your people.",
    color: "text-fuchsia-400",
  },
  {
    icon: Users,
    title: "Stay Connected",
    desc: "Follow your peers and teachers, exchange perspectives, and share some love.",
    color: "text-cyan-400",
  },
  {
    icon: Flame,
    title: "Keep Creating",
    desc: "Explore new ideas for your next project, post your work, and get feedback.",
    color: "text-amber-400",
  },
]

function Polaroid({ rotate, offset, tone }: { rotate: string; offset: string; tone: string }) {
  return (
    <div
      className={[
        "absolute rounded-xl bg-white shadow-[0_28px_70px_rgba(0,0,0,0.55)] ring-1 ring-black/10",
        "w-[220px] sm:w-[240px] md:w-[260px]",
        "p-3",
        rotate,
        offset,
      ].join(" ")}
    >
      <div className={["aspect-[4/3] w-full rounded-lg", tone].join(" ")} />
      <div className="mt-3 h-3 w-2/3 rounded bg-black/10" />
    </div>
  )
}

export default function HomeCreativeFeed() {
  return (
    <section className="bg-black py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <h2 className="text-4xl font-black tracking-tight text-white">
              Explore Your
              <br />
              Creative Feed
            </h2>
            <div className="mt-10 space-y-8">
              {items.map((it) => (
                <div key={it.title} className="text-center md:text-left">
                  <it.icon className={`mx-auto md:mx-0 h-7 w-7 ${it.color}`} />
                  <h3 className="mt-3 text-xl font-extrabold text-white">{it.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative mx-auto h-[320px] w-full max-w-[520px]">
              <Polaroid
                rotate="rotate-[-12deg]"
                offset="right-4 top-8"
                tone="bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.85),transparent_45%),radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.75),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(236,72,153,0.75),transparent_45%)]"
              />
              <Polaroid
                rotate="rotate-[8deg]"
                offset="right-20 top-20"
                tone="bg-[radial-gradient(circle_at_30%_25%,rgba(59,130,246,0.85),transparent_45%),radial-gradient(circle_at_75%_55%,rgba(168,85,247,0.7),transparent_45%),radial-gradient(circle_at_50%_85%,rgba(236,72,153,0.6),transparent_45%)]"
              />
              <Polaroid
                rotate="rotate-[-4deg]"
                offset="right-10 top-40"
                tone="bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.8),transparent_45%),radial-gradient(circle_at_70%_55%,rgba(34,197,94,0.7),transparent_45%),radial-gradient(circle_at_45%_85%,rgba(6,182,212,0.65),transparent_45%)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

