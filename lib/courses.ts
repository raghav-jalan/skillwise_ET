import { getSupabaseClient, isSupabaseConfigured, withTimeout } from "@/lib/supabase"

export type CourseRecord = {
  id: string
  title: string
  description: string | null
  category: string | null
  level: string | null
  price: number | null
  duration_hours: number | null
  estimated_duration: number | null
  is_published: boolean | null
  teacher_id: string | null
  created_at: string | null
  updated_at: string | null
  image_url?: string | null
}

export type LessonRecord = {
  id: string
  course_id: string
  title: string
  description: string | null
  duration_minutes: number | null
  order_index: number | null
}

export function slugifyCourseTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function getPublishedCourses(): Promise<CourseRecord[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabaseClient()
  const { data, error } = await withTimeout(
    supabase
      .from("courses")
      .select(
        "id, title, description, category, level, price, duration_hours, estimated_duration, is_published, teacher_id, created_at, updated_at",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    { label: "Published courses query", timeoutMs: 10000 },
  )

  if (error) {
    throw error
  }

  return (data ?? []) as CourseRecord[]
}

export async function getCourseBySlugOrId(slugOrId: string): Promise<CourseRecord | null> {
  if (!isSupabaseConfigured) return null

  const supabase = getSupabaseClient()

  if (isUuid(slugOrId)) {
    const { data, error } = await withTimeout(
      supabase
        .from("courses")
        .select(
          "id, title, description, category, level, price, duration_hours, estimated_duration, is_published, teacher_id, created_at, updated_at",
        )
        .eq("id", slugOrId)
        .eq("is_published", true)
        .maybeSingle(),
      { label: "Course detail query" },
    )

    if (error) throw error
    return (data as CourseRecord | null) ?? null
  }

  const { data, error } = await withTimeout(
    supabase.from("courses").select("id, title").eq("is_published", true),
    { label: "Course slug lookup query" },
  )
  if (error) throw error

  const matched = (data ?? []).find((course) => slugifyCourseTitle(course.title) === slugOrId)
  if (!matched) return null

  const { data: fullCourse, error: fullCourseError } = await withTimeout(
    supabase
      .from("courses")
      .select(
        "id, title, description, category, level, price, duration_hours, estimated_duration, is_published, teacher_id, created_at, updated_at",
      )
      .eq("id", matched.id)
      .maybeSingle(),
    { label: "Course record query" },
  )

  if (fullCourseError) throw fullCourseError
  return (fullCourse as CourseRecord | null) ?? null
}

export async function getCourseLessons(courseId: string): Promise<LessonRecord[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabaseClient()
  const { data, error } = await withTimeout(
    supabase
      .from("lessons")
      .select("id, course_id, title, description, duration_minutes, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true }),
    { label: "Course lessons query" },
  )

  if (error) throw error
  return (data ?? []) as LessonRecord[]
}
