import { getSupabaseClient, isSupabaseConfigured, withTimeout } from "@/lib/supabase"

export type JobPostRecord = {
  id: string
  company_name: string
  job_title: string
  location: string
  category: string
  job_type: string
  salary: string | null
  description: string
  requirements: string[] | null
  contact_email: string
  contact_phone: string | null
  status: "active" | "closed"
  created_at: string
}

export async function getActiveJobPosts(): Promise<JobPostRecord[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabaseClient()
  try {
    const { data, error } = await withTimeout(
      supabase
        .from("job_posts")
        .select(
          "id, company_name, job_title, location, category, job_type, salary, description, requirements, contact_email, contact_phone, status, created_at",
        )
        .eq("status", "active")
        .order("created_at", { ascending: false }),
      { label: "Active jobs query" },
    )

    if (error) throw error
    return (data ?? []) as JobPostRecord[]
  } catch {
    return []
  }
}
