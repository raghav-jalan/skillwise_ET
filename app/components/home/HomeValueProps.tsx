import { CheckCircle2 } from "lucide-react"

const bullets = [
  "Thousands of creative classes. Beginner to pro.",
  "Taught by creative pros and industry icons.",
  "Learning Paths to help you achieve your goals.",
  "Certificates to celebrate your accomplishments.",
]

export default function HomeValueProps() {
  return (
    <section className="bg-black pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Creative
              <br />
              Learning
              <br />
              Made Easy
            </h2>
          </div>
          <div className="md:col-span-8">
            <ul className="space-y-5">
              {bullets.map((text) => (
                <li key={text} className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-cyan-400" />
                  <span className="text-lg font-semibold leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

