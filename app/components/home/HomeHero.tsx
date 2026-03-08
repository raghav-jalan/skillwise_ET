import Link from "next/link"

type Provider = "google" | "facebook" | "apple"

function ProviderIcon({ provider }: { provider: Provider }) {
  const src = provider === "google" ? "/logos/google.png" : provider === "facebook" ? "/logos/facebook.png" : "/logos/apple.png"
  return <img src={src} alt="" className="h-5 w-5 object-contain" />
}

function ProviderButton({ provider, label }: { provider: Provider; label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/20 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
    >
      <ProviderIcon provider={provider} />
      <span>{label}</span>
    </button>
  )
}

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:py-20 md:grid-cols-12 md:gap-12">
        <div className="relative md:col-span-7">
          {/* Colorful blob sits left of the heading text — behind content */}
          <div className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 hidden md:block z-0">
            <svg
              className="h-[360px] w-[360px]"
              viewBox="0 0 420 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="squiggle" x1="60" y1="40" x2="360" y2="460" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#22c55e" />
                  <stop offset="30%"  stopColor="#06b6d4" />
                  <stop offset="65%"  stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path
                d="M60 40 C20 80, 20 140, 80 160 C140 180, 200 140, 200 200 C200 260, 120 280, 140 340 C160 400, 260 400, 300 360 C340 320, 360 380, 340 440"
                stroke="url(#squiggle)"
                strokeWidth="42"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="md:pl-36 relative z-10">
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl">
              Creative Classes Taught
              <br />
              by the Best Pros
            </h1>
            <p className="mt-5 max-w-xl text-base text-gray-700 sm:text-lg">
              Learn skills that move your career forward. Courses, projects, and a portal that connects students, teachers,
              and employers—powered by the same backend as the SkillUp app.
            </p>
            </div>
        </div>

        <div className="md:col-span-5 md:justify-self-end md:self-start">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
            <h2 className="text-center text-sm font-extrabold text-gray-900">
              Get 7 free days of <span className="underline decoration-emerald-400 decoration-4 underline-offset-4">SkillUp</span>
            </h2>
            <div className="mt-5 space-y-2">
              <ProviderButton provider="google" label="Continue with Google" />
              <ProviderButton provider="facebook" label="Continue with Facebook" />
              <ProviderButton provider="apple" label="Continue with Apple" />
            </div>
            <div className="mt-4 text-center">
              <Link href="/portal" className="text-sm font-semibold text-purple-700 hover:text-purple-800">
                Continue with email
              </Link>
            </div>
            <p className="mt-4 text-center text-[11px] leading-snug text-gray-600">
              By joining you agree to SkillUp&apos;s Terms and Privacy Policy. Trial includes access to courses and the role-based
              portal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

