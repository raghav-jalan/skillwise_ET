import { Building2, Users, GraduationCap, Landmark, Heart, Globe } from "lucide-react"

// Partner categories with their respective organizations
const partnerCategories = [
  {
    id: "corporate",
    name: "Corporate Partners",
    icon: Building2,
    description: "Leading companies supporting our mission through funding, expertise, and employment opportunities.",
    partners: [
      {
        name: "TechSolutions India",
        description: "Provides technical infrastructure and mentorship for IT courses.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "BuildRight Construction",
        description: "Offers internships and job placements for vocational trade graduates.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "GreenEarth Organics",
        description: "Supports agricultural training programs and sustainable farming practices.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Sunrise Healthcare",
        description: "Partners for healthcare training and community health initiatives.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "FastTrack Logistics",
        description: "Provides employment opportunities for logistics and delivery graduates.",
        logo: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ngo",
    name: "NGO Collaborations",
    icon: Heart,
    description:
      "Non-profit organizations working with us to reach underserved communities and maximize social impact.",
    partners: [
      {
        name: "Rural Empowerment Foundation",
        description: "Focuses on skill development in rural areas across multiple states.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Women's Livelihood Initiative",
        description: "Promotes women's participation in vocational training and entrepreneurship.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Youth Forward",
        description: "Specializes in skill development for at-risk youth and school dropouts.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Disability Inclusion Network",
        description: "Works to make skill training accessible for persons with disabilities.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Tribal Development Trust",
        description: "Focuses on traditional and modern skills for tribal communities.",
        logo: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "government",
    name: "Government Agencies",
    icon: Landmark,
    description: "Public sector organizations that provide policy support, funding, and certification recognition.",
    partners: [
      {
        name: "National Skill Development Corporation",
        description: "Provides certification and quality assurance for our training programs.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Ministry of Rural Development",
        description: "Supports rural livelihood initiatives through various schemes.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "State Department of Technical Education",
        description: "Recognizes our vocational training programs across multiple states.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "District Employment Exchange",
        description: "Helps connect our graduates with local employment opportunities.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Small Industries Development Bank",
        description: "Provides financial support for entrepreneurship initiatives.",
        logo: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "academic",
    name: "Academic Institutions",
    icon: GraduationCap,
    description: "Educational organizations that collaborate on curriculum development and research.",
    partners: [
      {
        name: "National Institute of Rural Development",
        description: "Collaborates on research and curriculum for rural skill development.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "State Polytechnic Colleges",
        description: "Provides technical expertise and faculty support for vocational courses.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Agricultural Universities Network",
        description: "Supports farming and agricultural skill development programs.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Healthcare Training Institutes",
        description: "Collaborates on healthcare and wellness training curriculum.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Industrial Training Institutes",
        description: "Partners for advanced technical training and certification.",
        logo: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "community",
    name: "Community Organizations",
    icon: Users,
    description: "Local groups that help us reach grassroots communities and understand local needs.",
    partners: [
      {
        name: "Village Self-Help Groups Federation",
        description: "Network of women's self-help groups across rural districts.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Urban Youth Collectives",
        description: "Community organizations working with urban youth in low-income areas.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Farmers' Producer Organizations",
        description: "Collectives of small farmers seeking agricultural skill enhancement.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Artisan Cooperatives",
        description: "Traditional craftspeople seeking to modernize their skills and market access.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Migrant Workers Support Network",
        description: "Helps migrant workers gain new skills for better employment.",
        logo: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "international",
    name: "International Collaborations",
    icon: Globe,
    description: "Global organizations that provide funding, expertise, and international best practices.",
    partners: [
      {
        name: "Global Skills Foundation",
        description: "International NGO supporting vocational training in developing countries.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "United Development Program",
        description: "Supports sustainable development goals through skill building.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "International Labor Organization",
        description: "Provides technical assistance and global best practices.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "World Education Forum",
        description: "Supports educational initiatives for marginalized communities.",
        logo: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Asian Development Partners",
        description: "Regional organization supporting vocational training across Asia.",
        logo: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
]

export default function PartnersList() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Valued Partners</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We collaborate with a diverse ecosystem of organizations committed to empowering communities through skill
            development.
          </p>
        </div>

        <div className="space-y-16">
          {partnerCategories.map((category) => (
            <div key={category.id} className="bg-gray-50 border border-gray-200 rounded-xl shadow-lg overflow-hidden p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <category.icon className="h-8 w-8 text-blue-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-700">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.partners.map((partner, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-cyan-400/10 hover:scale-105"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        className="w-16 h-16 object-contain mr-4 bg-white rounded-md p-2"
                      />
                      <h4 className="text-lg font-semibold text-gray-900">{partner.name}</h4>
                    </div>
                    <p className="text-gray-700 text-sm">{partner.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interested in Partnering With Us?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We're always looking for organizations that share our vision of empowering communities through skill
            development.
          </p>
          <a
            href="/contact"
            className="bg-cyan-500 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-cyan-400 transition-colors inline-block"
          >
            Become a Partner
          </a>
        </div>
      </div>
    </section>
  )
}
