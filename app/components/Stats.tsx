import { Users, BookOpen, Award, Briefcase } from 'lucide-react'

const stats = [
  { name: 'Active Learners', value: '100,000+', icon: Users },
  { name: 'Courses', value: '500+', icon: BookOpen },
  { name: 'Certifications Awarded', value: '50,000+', icon: Award },
  { name: 'Career Placements', value: '25,000+', icon: Briefcase },
]

export default function Stats() {
  return (
    <section className="bg-blue-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="mt-2 text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xl font-semibold text-blue-100">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
