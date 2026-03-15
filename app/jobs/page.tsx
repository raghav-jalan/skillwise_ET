import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import JobListings from "../components/JobListings"
import JobPostingForm from "../components/JobPostingForm"
import ResumeSubmissionForm from "../components/ResumeSubmissionForm"
import { getActiveJobPosts } from "@/lib/jobs"
import { isSupabaseConfigured } from "@/lib/supabase"

export default async function JobsPage() {
  const jobs = isSupabaseConfigured ? await getActiveJobPosts() : []

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main>
        <div className="py-12 border-b border-gray-100">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Job Opportunities
            </h1>
            <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto">
              Find the perfect job or post vacancies for skilled professionals from our training programs.
            </p>
          </div>
        </div>
        <JobListings jobs={jobs} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto max-w-6xl px-4 py-16">
          <JobPostingForm />
          <ResumeSubmissionForm />
        </div>
      </main>
      <HomeFooter />
    </div>
  )
}
