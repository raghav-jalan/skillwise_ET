'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: "How does SkillUp's platform work?",
    answer: "SkillUp offers a comprehensive online learning experience. You'll have access to video lessons, interactive quizzes, hands-on projects, and expert mentorship. Our adaptive learning technology personalizes your learning path based on your progress and goals."
  },
  {
    question: "Are the certifications recognized by employers?",
    answer: "Yes, our certifications are industry-recognized and valued by employers. We partner with leading companies to ensure our curriculum aligns with current industry needs and standards."
  },
  {
    question: "How long does it take to complete a course?",
    answer: "Course duration varies depending on the subject and depth of content. Most courses range from 4 to 12 weeks, but you can learn at your own pace. We provide estimated completion times for each course to help you plan your learning journey."
  },
  {
    question: "Is there any support available if I get stuck?",
    answer: "We offer multiple support channels including a community forum, live Q&A sessions with instructors, and email support. Plus, you'll have access to our AI-powered learning assistant for immediate help on course-related queries."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <button
                className="flex justify-between items-center w-full text-left p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-900" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-900" />
                )}
              </button>
              {openIndex === index && (
                <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-gray-300">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
