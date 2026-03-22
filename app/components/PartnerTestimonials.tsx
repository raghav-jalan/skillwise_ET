import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "SkillItUp has been an invaluable partner in our CSR initiatives. Their vocational training programs have helped us create meaningful impact in rural communities while building a skilled workforce pipeline for our industry.",
    author: "Rajiv Mehta",
    position: "CSR Head",
    company: "TechSolutions India",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The quality of training provided by SkillItUp is exceptional. Their graduates are well-prepared for the workplace, with both technical skills and professional attitudes that make them valuable employees from day one.",
    author: "Priya Singh",
    position: "HR Director",
    company: "BuildRight Construction",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "Our collaboration with SkillItUp has allowed us to reach remote tribal communities with quality skill development programs. Their flexible, culturally-sensitive approach ensures high participation and completion rates.",
    author: "Anand Verma",
    position: "Executive Director",
    company: "Tribal Development Trust",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "As a government agency, we've found SkillItUp to be a reliable implementation partner for our rural development schemes. Their transparent operations and measurable outcomes make them stand out in the skill development sector.",
    author: "Dr. Lakshmi Rao",
    position: "Joint Secretary",
    company: "Ministry of Rural Development",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The women in our self-help groups have transformed their lives through SkillItUp's training programs. Many have started small businesses or secured stable employment, significantly improving their family incomes.",
    author: "Sunita Devi",
    position: "Coordinator",
    company: "Village Self-Help Groups Federation",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "SkillItUp's approach to agricultural training combines traditional wisdom with modern techniques, making it particularly effective for small farmers. Their programs have helped increase productivity and sustainability in our region.",
    author: "Ramesh Patel",
    position: "President",
    company: "Farmers' Producer Organization",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function PartnerTestimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Partner Testimonials</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Hear what our partners have to say about working with SkillItUp and the impact of our collaborative efforts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden p-6 transition-all duration-300 hover:shadow-cyan-400/20 hover:scale-105"
            >
              <div className="mb-4">
                <Quote className="h-8 w-8 text-blue-900 opacity-50" />
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.author}</h3>
                  <p className="text-gray-600">{testimonial.position}</p>
                  <p className="text-blue-900">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Quote className="h-10 w-10 text-blue-900" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Impact Through Collaboration</h3>
              <p className="text-gray-700 mb-4">
                Our partnerships have enabled us to train over 100,000 individuals across India, with 75% of graduates
                securing employment or starting their own businesses within six months of completion.
              </p>
              <p className="text-gray-700">
                Together with our partners, we're building a more skilled, employable, and entrepreneurial India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
