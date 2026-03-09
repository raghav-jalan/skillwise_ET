"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { CourseRecord } from "@/lib/courses"

const fallbackCategories = [
  "Featured",
  "Technology",
  "Business",
  "Marketing",
  "Design",
  "Productivity",
  "Photography",
  "Creative Writing",
]

function titleize(v: string) {
  return v
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ")
}

const categoryImages: Record<string, string> = {
  "Electrician":    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=640&q=80",
  "Plumbing":       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80",
  "Carpenter":      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=640&q=80",
  "Photography":    "/photography-card .jpg",
  "Animation":      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=640&q=80",
  "Film & Video":   "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=640&q=80",
  "Freelance":      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&q=80",
  "Technology":     "https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&q=80",
  "Business":       "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=640&q=80",
  "Marketing":      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80",
  "Design":         "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&q=80",
  "Productivity":   "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&q=80",
  "Creative Writing":"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=640&q=80",
  "Featured":       "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=640&q=80",
}

function getCourseImage(course: CourseRecord): string | null {
  if (course.image_url) return course.image_url
  const cat = titleize(course.category ?? "Featured")
  return categoryImages[cat] ?? categoryImages["Featured"]
}

function categoryOf(c: CourseRecord) {
  return titleize(c.category ?? "Featured")
}

function hashToInt(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

function formatDuration(course: CourseRecord) {
  const hours = Math.max(0, course.estimated_duration ?? course.duration_hours ?? 0)
  const totalMinutes = Math.max(0, Math.round(hours * 60))
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h <= 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export default function HomeExploreCoursesClient({ courses }: { courses: CourseRecord[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const c of courses) set.add(categoryOf(c))
    const list = [...set].slice(0, 14)
    return list.length > 0 ? ["Featured", ...list.filter((x) => x !== "Featured")] : fallbackCategories
  }, [courses])

  const [active, setActive] = useState(categories[0] ?? "Featured")

  const visible = useMemo(() => {
    if (courses.length === 0) return []
    if (active === "Featured") return courses.slice(0, 12)
    return courses.filter((c) => categoryOf(c) === active).slice(0, 12)
  }, [active, courses])

  return (
    <section className="bg-black py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl">Explore Inspiring Online Courses</h2>

        <div className="mt-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {categories.map((c) => {
              const isActive = c === active
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors ring-1",
                    isActive
                      ? "bg-cyan-400 text-black ring-cyan-300"
                      : "bg-transparent text-white ring-white/40 hover:bg-white/10",
                  ].join(" ")}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white/5 p-8 text-center text-white ring-1 ring-white/10">
            <p className="text-sm text-white/80">
              Courses will appear here once the backend has published content. You can still browse the portal and other pages.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link href="/courses" className="rounded-lg bg-white px-5 py-2 text-sm font-bold text-black hover:bg-white/90">
                View all classes
              </Link>
              <Link href="/portal" className="rounded-lg bg-white/10 px-5 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/15">
                Open portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-transform hover:-translate-y-0.5"
              >
                <div className="relative aspect-[16/10] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 overflow-hidden">
                  {getCourseImage(course) ? (
                    <img
                      src={getCourseImage(course)!}
                      alt={course.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.9),transparent_45%),radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.75),transparent_42%),radial-gradient(circle_at_40%_80%,rgba(236,72,153,0.75),transparent_45%)]" />
                  )}
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute left-3 top-2 text-xs font-black text-white drop-shadow">Staff Pick.</div>
                  <div className="absolute left-3 bottom-2 inline-flex rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white/90 ring-1 ring-white/10">
                    {categoryOf(course)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3 text-[11px] text-gray-600">
                    <span>{formatDuration(course)}</span>
                  </div>
                  <div className="mt-2 line-clamp-2 text-[13px] font-extrabold leading-snug text-gray-950">
                    {course.title}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-gray-600">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    {titleize(course.level ?? "beginner")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/courses" className="text-sm font-bold text-white underline underline-offset-4 decoration-emerald-400 hover:decoration-emerald-300">
            Browse all courses
          </Link>
        </div>
      </div>
    </section>
  )
}

