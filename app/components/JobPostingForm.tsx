"use client"

import type React from "react"

import { useState } from "react"
import { Briefcase, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

export default function JobPostingForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    salary: "",
    description: "",
    requirements: [""],
    contactEmail: "",
    contactPhone: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements]
    updatedRequirements[index] = value
    setFormData((prev) => ({ ...prev, requirements: updatedRequirements }))
  }

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }))
  }

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const updatedRequirements = [...formData.requirements]
      updatedRequirements.splice(index, 1)
      setFormData((prev) => ({ ...prev, requirements: updatedRequirements }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError(false)

    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase not configured")
      }

      const cleanedRequirements = formData.requirements
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

      const supabase = getSupabaseClient()
      const { error } = await supabase.from("job_posts").insert({
        company_name: formData.companyName,
        job_title: formData.jobTitle,
        location: formData.location,
        category: formData.category,
        job_type: formData.jobType,
        salary: formData.salary.trim() || null,
        description: formData.description,
        requirements: cleanedRequirements,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone.trim() || null,
        source: "web",
        status: "active",
      })

      if (error) {
        throw error
      }

      setSubmitSuccess(true)
      setFormData({
        companyName: "",
        jobTitle: "",
        location: "",
        category: "",
        jobType: "",
        salary: "",
        description: "",
        requirements: [""],
        contactEmail: "",
        contactPhone: "",
      })
      router.refresh()
    } catch (error) {
      setSubmitError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-100 rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
          <Briefcase className="h-6 w-6 text-blue-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-green-800">Your job has been posted successfully and is now visible to students.</p>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-800">There was an error posting your job. Please try again.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name*
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title*
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
              placeholder="City, State or Remote"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            >
              <option value="">Select a category</option>
              <option value="Vocational Trades">Vocational Trades</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Logistics">Logistics</option>
              <option value="Electronics">Electronics</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Tailoring & Fashion">Tailoring & Fashion</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type*
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            >
              <option value="">Select job type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
              placeholder="e.g. Rs 15,000 - Rs 20,000 per month"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            placeholder="Describe the job responsibilities and expectations"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements*</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                required
                className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                placeholder={`Requirement ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="ml-2 p-2 text-gray-500 hover:text-red-600 transition-colors"
                disabled={formData.requirements.length <= 1}
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="flex items-center text-blue-900 hover:text-cyan-600 transition-colors mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Requirement</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email*
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  )
}
