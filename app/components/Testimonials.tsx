import { Star } from 'lucide-react'

const testimonials = [
  {
    content: "Before SkillUp India, I was doing odd jobs. After completing the electrician course, I now run my own small repair service in my village. The offline lessons were a lifesaver for me.",
    author: {
      name: 'Manoj Kumar',
      role: 'Electrician',
    },
    rating: 5
  },
  {
    content: "The home nursing course was so easy to follow, even for someone like me with no previous experience. I now work as a caregiver for elderly patients in my city.",
    author: {
      name: 'Suman Kumari',
      role: 'Home Nurse',
    },
    rating: 5
  },
  {
    content: "I learned about organic farming techniques and now grow vegetables without chemicals. Local markets love my produce and my income has doubled.",
    author: {
      name: 'Pooja Kumari',
      role: 'Farmer',
    },
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Success Stories
        </h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-900">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-blue-900">{testimonial.author.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.author.name}</h3>
                  <p className="text-gray-600">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
