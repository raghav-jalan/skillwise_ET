import { Suspense } from "react"
import HomeHeader from "./components/home/HomeHeader"

export const dynamic = "force-dynamic"

import HomeHero from "./components/home/HomeHero"
import HomeCategoryMarquee from "./components/home/HomeCategoryMarquee"
import HomeValueProps from "./components/home/HomeValueProps"
import HomeStatsStrip from "./components/home/HomeStatsStrip"
import HomeExploreCourses, { HomeExploreCoursesFallback } from "./components/home/HomeExploreCourses"
import HomeCreativeFeed from "./components/home/HomeCreativeFeed"
import HomeExpertsAndTestimonials from "./components/home/HomeExpertsAndTestimonials"
import HomeTeamsCta from "./components/home/HomeTeamsCta"
import HomeFaq from "./components/home/HomeFaq"
import HomePressStrip from "./components/home/HomePressStrip"
import HomeClassDirectory from "./components/home/HomeClassDirectory"
import HomeFooter from "./components/home/HomeFooter"
import { getPublishedCourses } from "@/lib/courses"
import { isSupabaseConfigured } from "@/lib/supabase"
import HomeExploreCoursesClient from "./components/home/HomeExploreCoursesClient"

export default async function Home() {
  let courses = []
  if (isSupabaseConfigured) {
    try {
      courses = await getPublishedCourses()
    } catch (e) {
      console.error("[Home] courses fetch error:", e)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeCategoryMarquee />
        <HomeValueProps />
        <HomeStatsStrip />
        <HomeExploreCoursesClient courses={courses} />
        <HomeCreativeFeed />
        <HomeExpertsAndTestimonials />
        <HomeTeamsCta />
        <HomeFaq />
        <HomePressStrip />
        <HomeClassDirectory />
      </main>
      <HomeFooter />
    </div>
  )
}
