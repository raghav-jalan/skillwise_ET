"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Upload } from "lucide-react"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

const MAX_FILE_SIZE = 5 * 1024 * 1024

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export default function ResumeSubmissionForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobCategory: "",
    experience: "",
    education: "",
    coverLetter: "",
    resumeFile: null as File | null,
    resumeFileName: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
        resumeFileName: file.name,
      }))
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
      if (!formData.resumeFile) {
        throw new Error("Resume file is required")
      }
      if (formData.resumeFile.size > MAX_FILE_SIZE) {
        throw new Error("Resume file exceeds size limit")
      }

      const supabase = getSupabaseClient()
      const timestamp = Date.now()
      const safeFileName = sanitizeFileName(formData.resumeFile.name)
      const storagePath = `resume-submissions/${timestamp}-${safeFileName}`

      const { error: uploadError } = await supabase.storage.from("resumes").upload(storagePath, formData.resumeFile, {
        upsert: false,
      })

      if (uploadError) {
        throw uploadError
      }

      const { error: insertError } = await supabase.from("resume_submissions").insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        job_category: formData.jobCategory,
        experience: formData.experience.trim() || null,
        education: formData.education.trim() || null,
        cover_letter: formData.coverLetter.trim() || null,
        resume_storage_path: storagePath,
        resume_file_name: formData.resumeFile.name,
        resume_file_size_bytes: formData.resumeFile.size,
        resume_content_type: formData.resumeFile.type || null,
        source: "web",
      })

      if (insertError) {
        throw insertError
      }

      setSubmitSuccess(true)
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        jobCategory: "",
        experience: "",
        education: "",
        coverLetter: "",
        resumeFile: null,
        resumeFileName: "",
      })
    } catch (error) {
      setSubmitError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="resume-form" className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <FileText className="h-6 w-6 text-blue-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Submit Your Resume</h2>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-green-800">
            Your resume has been submitted successfully. Employers will contact you if there&apos;s a match.
          </p>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-800">There was an error submitting your resume. Please try again.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="jobCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Job Category*
            </label>
            <select
              id="jobCategory"
              name="jobCategory"
              value={formData.jobCategory}
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
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Work Experience
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
              placeholder="e.g. 2 years as an electrician"
            />
          </div>
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
              Education/Certification
            </label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
              placeholder="e.g. Certificate in Electrical Work"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
            placeholder="Tell employers about yourself and why you're a good fit"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume*</label>
          <div className="flex items-center">
            <label className="flex-grow cursor-pointer bg-white border border-gray-300 rounded-md overflow-hidden">
              <div className="flex items-center">
                <div className="px-4 py-2 bg-gray-100 border-r border-gray-300 text-gray-900">Choose File</div>
                <div className="px-4 py-2 text-gray-700 truncate">{formData.resumeFileName || "No file chosen"}</div>
              </div>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="hidden"
              />
            </label>
            <div className="ml-2 p-2 bg-white border border-gray-300 rounded-md text-blue-900">
              <Upload className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-500 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-cyan-400 transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Resume"}
        </button>
      </form>
    </div>
  )
}
