import Link from "next/link"
import { Search, BookOpen, HelpCircle, FileText, MessageSquare, Video } from "lucide-react"

const helpCategories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of using SkillItUp platform",
    articles: [
      "How to create an account",
      "Navigating the dashboard",
      "Enrolling in your first course",
      "Understanding course materials",
    ],
  },
  {
    title: "Technical Support",
    icon: HelpCircle,
    description: "Resolve common technical issues",
    articles: ["Video playback problems", "Download issues", "Mobile app troubleshooting", "Browser compatibility"],
  },
  {
    title: "Billing & Payments",
    icon: FileText,
    description: "Manage your subscription and payments",
    articles: [
      "Payment methods accepted",
      "Subscription plans explained",
      "Requesting refunds",
      "Invoice and receipt access",
    ],
  },
  {
    title: "Course Support",
    icon: MessageSquare,
    description: "Get help with course content and assignments",
    articles: [
      "Contacting instructors",
      "Assignment submission help",
      "Peer review process",
      "Course completion certificates",
    ],
  },
  {
    title: "Video Tutorials",
    icon: Video,
    description: "Watch step-by-step guides",
    articles: [
      "Platform navigation tutorial",
      "How to use interactive features",
      "Mobile app walkthrough",
      "Accessing learning resources",
    ],
  },
]

export default function HelpCenter() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Help Center</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Find answers to your questions and learn how to get the most out of SkillItUp.
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-5 py-3 bg-white border border-gray-200 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 pr-12"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-900">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-400/20 hover:scale-105"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <category.icon className="h-6 w-6 text-blue-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-700 mb-4">{category.description}</p>

                <ul className="space-y-2 mb-4">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <Link href="#" className="text-blue-900 hover:text-blue-800 transition-colors">
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link href="#" className="inline-block text-gray-900 hover:text-blue-900 transition-colors font-medium">
                  View all articles →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            If you couldn't find what you're looking for, our support team is ready to assist you.
          </p>
          <Link
            href="/contact"
            className="bg-blue-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-cyan-400 transition-colors inline-flex items-center justify-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  )
}
