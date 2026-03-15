import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import { getPublishedCourses } from "@/lib/courses"
import { isSupabaseConfigured } from "@/lib/supabase"
import HomeExploreCoursesClient from "../components/home/HomeExploreCoursesClient"

export const dynamic = "force-dynamic"

export default async function Courses() {
  let courses: Awaited<ReturnType<typeof getPublishedCourses>> = []
  if (isSupabaseConfigured) {
    try {
      courses = await getPublishedCourses()
    } catch {
      courses = []
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main>
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              All Courses
            </h1>
            <p className="mt-4 text-base text-gray-600 max-w-xl mx-auto">
              Practical, industry-relevant training designed to enhance your skills and career.
            </p>
          </div>
        </div>
        <HomeExploreCoursesClient courses={courses} />
      </main>
      <HomeFooter />
    </div>
  )
}
