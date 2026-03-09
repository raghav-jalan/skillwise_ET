import Link from "next/link"
import Image from "next/image"

export default function HomeTeamsCta() {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-3">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">SkillUp for Teams</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Set your team up for success with reimagined learning to empower their personal and professional growth.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              With inspiring classes across soft skills, business essentials, and more, your whole team will have deep knowledge
              and expertise at their fingertips.
            </p>
            <div className="mt-6">
              <Link
                href="/partners"
                className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="overflow-hidden rounded-lg ring-1 ring-white/10">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/teams-cta.png"
                  alt="Teams learning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

