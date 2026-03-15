"use client"

import { useMemo, useState } from "react"
import { Search, MapPin, Briefcase, Clock, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import type { JobPostRecord } from "@/lib/jobs"

type JobListingsProps = {
  jobs: JobPostRecord[]
}

export default function JobListings({ jobs }: JobListingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  const categories = useMemo(() => {
    const values = Array.from(new Set(jobs.map((job) => job.category).filter(Boolean))).sort()
    return ["All Categories", ...values]
  }, [jobs])

  const locations = useMemo(() => {
    const values = Array.from(new Set(jobs.map((job) => job.location).filter(Boolean))).sort()
    return ["All Locations", ...values]
  }, [jobs])

  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.toLowerCase()
    const matchesSearch =
      job.job_title.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)

    const matchesCategory = selectedCategory === "All Categories" || job.category === selectedCategory
    const matchesLocation = selectedLocation === "All Locations" || job.location === selectedLocation
    return matchesSearch && matchesCategory && matchesLocation
  })

  const calculateDaysAgo = (dateString: string) => {
    const postedDate = new Date(dateString)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-xl p-4 mb-8 shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-400/20 border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{job.job_title}</h3>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <span className="text-blue-900 text-sm font-medium">
                        Posted {calculateDaysAgo(job.created_at)} days ago
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-900" />
                      {job.company_name}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 text-blue-900" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-blue-900" />
                      {job.job_type}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-blue-900/20 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                      {job.category}
                    </span>
                    {job.salary && (
                      <span className="inline-block ml-2 bg-gray-200 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {job.salary}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{job.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <button
                      onClick={() => toggleJobExpansion(job.id)}
                      className="flex items-center text-blue-900 hover:text-cyan-600 transition-colors"
                    >
                      {expandedJob === job.id ? (
                        <>
                          <span>Show Less</span>
                          <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Show More</span>
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                    <Link
                      href={`#apply-${job.id}`}
                      className="mt-4 sm:mt-0 bg-blue-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-colors inline-block text-center"
                      onClick={() => document.getElementById("resume-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Apply Now
                    </Link>
                  </div>

                  {expandedJob === job.id && (
                    <div className="mt-6 pt-6 border-t border-gray-300">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                      {job.requirements && job.requirements.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={`${job.id}-${index}`}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700">No specific requirements listed.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-100 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-700">Try adjusting your search filters to find more opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
