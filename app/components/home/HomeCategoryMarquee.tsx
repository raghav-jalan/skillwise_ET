"use client"

import { useEffect, useMemo, useRef } from "react"

type MarqueeItem = {
  label: string
  gradient: string
  image?: string
}

const items: MarqueeItem[] = [
  { label: "Animation", gradient: "from-fuchsia-500 to-purple-600", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=640&q=80" },
  { label: "Film & Video", gradient: "from-sky-500 to-blue-700", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=640&q=80" },
  { label: "Freelance", gradient: "from-emerald-500 to-green-700", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&q=80" },
  { label: "Electrician", gradient: "from-amber-500 to-orange-700", image: "/electrician.jpg" },
  { label: "Carpenter", gradient: "from-teal-400 to-cyan-700", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=640&q=80" },
  { label: "Photography", gradient: "from-rose-500 to-pink-700", image: "/photography-card .jpg" },
  { label: "Plumbing", gradient: "from-lime-400 to-emerald-700", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80" },
]

function usePrefersReducedMotion() {
  const ref = useRef(false)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => {
      ref.current = mql.matches
    }
    onChange()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    mql.addEventListener ? mql.addEventListener("change", onChange) : mql.addListener(onChange)
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      mql.removeEventListener ? mql.removeEventListener("change", onChange) : mql.removeListener(onChange)
    }
  }, [])
  return ref
}

export default function HomeCategoryMarquee() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const track = useMemo(() => {
    // duplicate for seamless loop
    return [...items, ...items]
  }, [])

  return (
    <section className="relative z-30 -mt-10 -mb-10 bg-transparent sm:-mt-12 sm:-mb-12">
      <div className="w-full overflow-hidden">
        <div
          className={[
            "flex w-max gap-0 py-3",
            prefersReducedMotion.current ? "" : "animate-[home-marquee_28s_linear_infinite]",
          ].join(" ")}
          style={
            prefersReducedMotion.current
              ? undefined
              : ({
                  willChange: "transform",
                } as const)
          }
        >
          {track.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="relative w-[320px] flex-shrink-0 overflow-hidden rounded-none shadow-none ring-0"
              style={{ height: "352px" }}
            >
              {item.image ? (
                <img src={item.image} alt={item.label} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute left-5 top-5 text-base font-extrabold text-white drop-shadow">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes home-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  )
}

