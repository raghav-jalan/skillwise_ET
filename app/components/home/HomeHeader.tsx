"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, Search } from "lucide-react"
import HomeAuthModal from "./HomeAuthModal"

const categories = [
  "AI & Innovation",
  "Animation & 3D",
  "Art & Illustration",
  "Crafts & DIY",
  "Creative Career",
  "Creativity & Inspiration",
  "Design",
  "Development",
  "Film & Video",
  "Home & Lifestyle",
  "Marketing & Business",
  "Music & Audio",
  "Personal Development",
  "Photography",
  "Productivity",
  "Writing & Publishing",
]

const contentTypeLinks = [
  { label: "All Classes", href: "/courses" },
  { label: "All Learning Paths", href: "/learning-process" },
  { label: "All Student Projects", href: "/portal" },
]

const shopLinks = [
  { label: "Digital Products", href: "/courses" },
  { label: "1-on-1 Sessions", href: "/portal" },
  { label: "Live Sessions", href: "/portal" },
]

const exploreLinks = [
  { label: "Partners", href: "/partners" },
  { label: "Jobs", href: "/jobs" },
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
]

export default function HomeHeader() {
  const [browseOpen, setBrowseOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("register")
  const browseRef = useRef<HTMLDivElement | null>(null)

  const searchHref = useMemo(() => {
    const q = query.trim()
    if (!q) return "/courses"
    return `/courses?q=${encodeURIComponent(q)}`
  }, [query])

  useEffect(() => {
    if (!browseOpen) return
    const onDown = (e: MouseEvent) => {
      if (!browseRef.current) return
      if (!(e.target instanceof Node)) return
      if (!browseRef.current.contains(e.target)) setBrowseOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBrowseOpen(false)
    }
    window.addEventListener("mousedown", onDown)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [browseOpen])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-16 flex items-center gap-4">
          <Link href="/" className="font-black tracking-tight text-lg">
            skillup
          </Link>

          <div className="relative" ref={browseRef}>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-black"
              onClick={() => setBrowseOpen((v) => !v)}
            >
              Browse <ChevronDown className={`h-4 w-4 transition-transform ${browseOpen ? "rotate-180" : ""}`} />
            </button>
            {browseOpen && (
              <div
                className="absolute left-0 mt-3 w-[820px] max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.18)] overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-8 p-8">
                    <div className="text-xs font-extrabold tracking-[0.14em] text-gray-500">CLASSES BY CATEGORY</div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                      {categories.map((c) => (
                        <Link
                          key={c}
                          href="/courses"
                          className="text-base font-extrabold text-gray-950 hover:underline underline-offset-4"
                          onClick={() => setBrowseOpen(false)}
                        >
                          {c}
                        </Link>
                      ))}
                      {exploreLinks.map((l) => (
                        <Link
                          key={l.label}
                          href={l.href}
                          className="text-base font-extrabold text-gray-500 hover:text-gray-950 hover:underline underline-offset-4"
                          onClick={() => setBrowseOpen(false)}
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-black/10 p-8 space-y-8 overflow-y-auto max-h-[520px]">
                    <div>
                      <div className="text-xs font-extrabold tracking-[0.14em] text-gray-500">BY CONTENT TYPE</div>
                      <div className="mt-4 space-y-3">
                        {contentTypeLinks.map((l) => (
                          <Link
                            key={l.label}
                            href={l.href}
                            className="block rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-bold text-gray-950 hover:bg-gray-50"
                            onClick={() => setBrowseOpen(false)}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold tracking-[0.14em] text-gray-500">SHOP</div>
                      <div className="mt-4 space-y-3">
                        {shopLinks.map((l) => (
                          <Link
                            key={l.label}
                            href={l.href}
                            className="block rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-bold text-gray-950 hover:bg-gray-50"
                            onClick={() => setBrowseOpen(false)}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold tracking-[0.14em] text-gray-500">EXPLORE</div>
                      <Link
                        href="/partners"
                        className="mt-4 inline-flex w-full items-center justify-between rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-bold text-gray-950 hover:bg-gray-50"
                        onClick={() => setBrowseOpen(false)}
                      >
                        Blog <span className="text-gray-500">↗</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search classes, teachers, and more"
                className="w-full rounded-full border border-black/10 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
              />
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              className="text-sm font-semibold text-gray-800 hover:text-black"
              onClick={() => {
                setAuthMode("login")
                setAuthOpen(true)
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-black hover:bg-emerald-300 transition-colors"
              onClick={() => {
                setAuthMode("register")
                setAuthOpen(true)
              }}
            >
              Sign Up
            </button>
          </nav>

          <div className="sm:hidden">
            <Link
              href="/portal"
              className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-black hover:bg-emerald-300 transition-colors"
            >
              Portal
            </Link>
          </div>
        </div>
      </div>
      </header>
      <HomeAuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} />
    </>
  )
}

