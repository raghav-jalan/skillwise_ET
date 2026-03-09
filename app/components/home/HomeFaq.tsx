"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    q: "What is SkillUp?",
    a: "SkillUp is a learning platform with courses, projects, certificates, and a unified portal for students, teachers, and employers.",
  },
  {
    q: "What’s included in membership?",
    a: "You get access to published classes and learning features. Teacher/employee accounts may require admin approval depending on role.",
  },
  {
    q: "What can I learn on SkillUp?",
    a: "A mix of practical, industry-relevant skills across technology, business, design, and more—based on what’s published in the course catalog.",
  },
  {
    q: "What happens after the trial?",
    a: "You can continue using the platform and portal. Plans and billing can be configured as you evolve the product offering.",
  },
  {
    q: "Can I teach on SkillUp?",
    a: "Yes. Create a teacher account in the portal. Some roles require approval by the main admin before publishing content.",
  },
]

export default function HomeFaq() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">Frequently Asked Questions</h2>

        <div className="mt-10 divide-y divide-black/10 rounded-2xl border border-black/10">
          {faqs.map((item, idx) => {
            const isOpen = open === idx
            return (
              <div key={item.q} className="bg-white">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : idx)}
                >
                  <span className="text-base font-semibold text-gray-950">{item.q}</span>
                  <Plus className={`h-5 w-5 text-gray-900 transition-transform ${isOpen ? "rotate-45" : ""}`} />
                </button>
                {isOpen && <div className="px-5 pb-6 -mt-1 text-sm text-gray-700">{item.a}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

