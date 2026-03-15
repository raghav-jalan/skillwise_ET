"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Clock, BarChart, ArrowRight, Search, Filter, ChevronDown, ChevronUp, IndianRupee } from "lucide-react"
import type { CourseRecord } from "@/lib/courses"

type CourseShowcaseProps = {
  courses: CourseRecord[]
}

type CourseCategory = {
  id: string
  name: string
  courses: CourseRecord[]
}

const categoryColors = [
  "from-blue-900 to-blue-800",
  "from-green-700 to-green-600",
  "from-amber-700 to-amber-600",
  "from-slate-700 to-slate-600",
  "from-red-700 to-red-600",
  "from-cyan-700 to-cyan-600",
]

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function normalizeCategory(value: string | null) {
  if (!value) return "Uncategorized"
  return toTitleCase(value.replace(/[_-]+/g, " "))
}

function normalizeLevel(value: string | null) {
  if (!value) return "Beginner"
  return toTitleCase(value.replace(/[_-]+/g, " "))
}

function courseDurationHours(course: CourseRecord) {
  return course.estimated_duration ?? course.duration_hours ?? 0
}

function formatPrice(price: number | null) {
  if (price === null || Number.isNaN(price)) return "Free"
  return `₹${price.toLocaleString("en-IN")}`
}

export default function CourseShowcase({ courses }: CourseShowcaseProps) {
  const categories = useMemo<CourseCategory[]>(() => {
    const grouped = new Map<string, CourseRecord[]>()

    for (const course of courses) {
      const categoryName = normalizeCategory(course.category)
      const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const existing = grouped.get(categoryId) ?? []
      existing.push(course)
      grouped.set(categoryId, existing)
    }

    return [...grouped.entries()].map(([id, categoryCourses]) => ({
      id,
      name: categoryCourses.length > 0 ? normalizeCategory(categoryCourses[0].category) : "Uncategorized",
      courses: categoryCourses,
    }))
  }, [courses])

  const [activeCategory, setActiveCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    level: "all",
    duration: "all",
  })

  useEffect(() => {
    if (categories.length > 0 && !categories.some((category) => category.id === activeCategory)) {
      setActiveCategory(categories[0].id)
    }
  }, [categories, activeCategory])

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => {
        const filteredCategoryCourses = category.courses.filter((course) => {
          const title = course.title.toLowerCase()
          const description = (course.description ?? "").toLowerCase()
          const normalizedLevel = normalizeLevel(course.level).toLowerCase()
          const duration = courseDurationHours(course)

          const matchesSearch =
            searchTerm.trim() === "" || title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())

          const matchesLevel = filters.level === "all" || normalizedLevel.includes(filters.level.toLowerCase())

          const matchesDuration =
            filters.duration === "all" ||
            (filters.duration === "short" && duration <= 20) ||
            (filters.duration === "medium" && duration > 20 && duration <= 40) ||
            (filters.duration === "long" && duration > 40)

          return matchesSearch && matchesLevel && matchesDuration
        })

        return {
          ...category,
          courses: filteredCategoryCourses,
        }
      })
      .filter((category) => category.courses.length > 0)
  }, [categories, filters.duration, filters.level, searchTerm])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const handleFilterChange = (filterType: "level" | "duration", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover practical, industry-focused training programs powered by the same backend as the SkillUp India mobile app.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-8 shadow border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 font-medium"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Level</label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900"
                      value={filters.level}
                      onChange={(e) => handleFilterChange("level", e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Duration</label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900"
                      value={filters.duration}
                      onChange={(e) => handleFilterChange("duration", e.target.value)}
                    >
                      <option value="all">Any Duration</option>
                      <option value="short">Short (up to 20 hours)</option>
                      <option value="medium">Medium (21-40 hours)</option>
                      <option value="long">Long (more than 40 hours)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${categoryColors[index % categoryColors.length]} text-white shadow`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden mb-8">
          {filteredCategories.map((category, index) => (
            <div key={category.id} className="mb-4">
              <button
                className={`w-full flex justify-between items-center p-4 rounded-lg bg-gradient-to-r ${
                  categoryColors[index % categoryColors.length]
                } text-white font-semibold`}
                onClick={() => toggleCategory(category.id)}
              >
                <span>{category.name}</span>
                {expandedCategory === category.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {expandedCategory === category.id && (
                <div className="mt-2 grid gap-4">
                  {category.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-900"
                    >
                      <div className="p-6">
                        <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">{category.name}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{course.description ?? "Course details will be available soon."}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-3 gap-3">
                          <span className="inline-flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {courseDurationHours(course)} hours
                          </span>
                          <span className="inline-flex items-center">
                            <BarChart className="h-4 w-4 mr-1" />
                            {normalizeLevel(course.level)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 mb-4">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {formatPrice(course.price)}
                        </div>
                        <Link
                          href={`/courses/${course.id}`}
                          className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-block text-center"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          {filteredCategories.map((category, index) => (
            <div key={category.id} className={`transition-opacity duration-500 ${activeCategory === category.id ? "block" : "hidden"}`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-900"
                  >
                    <div className="h-2 bg-gradient-to-r w-full overflow-hidden">
                      <div className={`h-full w-full bg-gradient-to-r ${categoryColors[index % categoryColors.length]}`}></div>
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">{category.name}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{course.description ?? "Course details will be available soon."}</p>
                      <div className="flex items-center text-sm text-gray-600 mb-3 gap-3">
                        <span className="inline-flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {courseDurationHours(course)} hours
                        </span>
                        <span className="inline-flex items-center">
                          <BarChart className="h-4 w-4 mr-1" />
                          {normalizeLevel(course.level)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 mb-4">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {formatPrice(course.price)}
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-block text-center"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you&apos;re looking for.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="bg-cyan-500 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-cyan-400 transition-colors inline-flex items-center justify-center"
          >
            Request a Course <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
