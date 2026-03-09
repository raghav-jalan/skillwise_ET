import Link from "next/link"

const columns = [
  {
    heading: "Art and Illustration",
    links: [
      "Illustration classes",
      "Digital art classes",
      "Drawing classes",
      "Painting classes",
      "Watercolor classes",
    ],
  },
  {
    heading: "Graphic Design",
    links: [
      "Graphic design classes",
      "UI/UX design classes",
      "Type design classes",
      "Surface pattern design classes",
      "Motion design classes",
    ],
  },
  {
    heading: "Creative Career",
    links: [
      "Marketing classes",
      "Freelance classes",
      "AI classes",
      "Productivity classes",
      "Social media classes",
    ],
  },
  {
    heading: "Film, Video, and Photography",
    links: [
      "Film career classes",
      "Video production classes",
      "Photography technique classes",
      "Photography editing classes",
      "Content creation classes",
    ],
  },
  {
    heading: "Software",
    links: [
      "Procreate classes",
      "Adobe Illustrator classes",
      "ChatGPT classes",
      "Blender classes",
      "Canva classes",
    ],
  },
  {
    heading: "Trending Classes",
    links: [
      "Kickstart your Creativity with Procreate",
      "How to Draw: A Beginner's Guide",
      "Social Media Content Creation in Canva",
      "Landscapes: A Free-Flow Watercolour Masterclass",
      "Develop a Sketchbook Habit in 30 Days",
    ],
  },
]

export default function HomeClassDirectory() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-black text-gray-950">{col.heading}</h3>
              <ul className="mt-3 space-y-1.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/courses"
                      className="text-sm text-gray-600 hover:text-gray-950 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/courses" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700">
                    More...
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
