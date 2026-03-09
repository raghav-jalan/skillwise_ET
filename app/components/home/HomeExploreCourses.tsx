import { getPublishedCourses, type CourseRecord } from "@/lib/courses"
import { isSupabaseConfigured } from "@/lib/supabase"
import HomeExploreCoursesClient from "./HomeExploreCoursesClient"

export function HomeExploreCoursesFallback() {
  return <HomeExploreCoursesClient courses={[]} />
}

export default async function HomeExploreCourses() {
  let courses: CourseRecord[] = []

  if (isSupabaseConfigured) {
    try {
      courses = await getPublishedCourses()
      console.log("[HomeExploreCourses] fetched:", courses.length, "courses")
    } catch (e) {
      console.error("[HomeExploreCourses] fetch error:", e)
      courses = []
    }
  } else {
    console.warn("[HomeExploreCourses] Supabase not configured")
  }

  return <HomeExploreCoursesClient courses={courses} />
}

