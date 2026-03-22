import Link from "next/link"
import { BookOpen, Video, Award, Users, Zap, Globe, ArrowRight } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description:
      "Access a wide range of courses designed by industry experts, covering the latest trends and technologies.",
  },
  {
    icon: Video,
    title: "Interactive Learning",
    description:
      "Engage with high-quality video lessons, hands-on projects, and real-world simulations for an immersive learning experience.",
  },
  {
    icon: Award,
    title: "Industry Certifications",
    description:
      "Earn recognized certifications that validate your skills and boost your career prospects in the job market.",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description:
      "Get personalized guidance from industry professionals and connect with a community of like-minded learners.",
  },
  {
    icon: Zap,
    title: "Adaptive Learning",
    description:
      "Our AI-powered platform adapts to your learning pace and style, ensuring efficient and effective skill acquisition.",
  },
  {
    icon: Globe,
    title: "Global Opportunities",
    description:
      "Gain access to a global network of employers and job opportunities tailored to your newly acquired skills.",
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose SkillItUp?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the SkillUp advantage and supercharge your career growth with our innovative learning platform.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-900"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-flex items-center justify-center"
          >
            Explore Our Courses <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
