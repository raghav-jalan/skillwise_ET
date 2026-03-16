import { getSupabaseBrowserAuthClient } from "@/lib/supabase"
import type { JobPostRecord } from "@/lib/jobs"

export type PortalRole = "student" | "teacher" | "employee" | "admin" | "unknown"

export type CourseLite = {
  id: string
  title: string
  description: string | null
  category: string | null
  level: string | null
  duration_hours: number | null
  estimated_duration: number | null
  price: number | null
  is_published: boolean | null
  teacher_id: string | null
  created_at: string | null
}

export type EnrollmentLite = {
  id: string
  course_id: string
  status: string
  enrolled_at: string
}

export type ProgressLite = {
  id?: string
  enrollment_id: string
  student_id?: string | null
  completion_percentage: number | null
  overall_progress?: number | null
  lessons_completed: number | null
  total_lessons: number | null
  completed_lessons?: string[] | null
  lesson_progress?: Record<string, number> | null
  current_lesson_id?: string | null
  last_accessed_at?: string | null
}

export type LessonLite = {
  id: string
  course_id: string | null
  title: string
  description: string | null
  content_url: string | null
  type: string | null
  order_index: number | null
  duration_minutes: number | null
}

export type UserProfileLite = {
  id: string
  full_name: string | null
  email: string | null
  phone_number: string | null
  role: string | null
  experience: string | null
  qualifications: string | null
  demo_video_url: string | null
  approval_status: string | null
}

export type TeacherCourseInput = {
  title: string
  description: string
  category: string
  level: string
  price: number
  estimated_duration: number
  is_published?: boolean
}

export type EmployeeJobInput = {
  company_name: string
  job_title: string
  location: string
  category: string
  job_type: string
  salary?: string | null
  description: string
  requirements: string[]
  contact_email: string
  contact_phone?: string | null
}

export type StudentDashboardData = {
  courses: CourseLite[]
  enrollments: EnrollmentLite[]
  progressByEnrollmentId: Record<string, ProgressLite>
  jobs: JobPostRecord[]
}

export type TeacherDashboardData = {
  courses: CourseLite[]
  totalCourses: number
  activeCourses: number
  totalEnrollments: number
  totalStudents: number
  completedEnrollments: number
  monthlyEarnings: number
  totalEarnings: number
}

export type AdminSnapshot = {
  users: Array<{ id: string; full_name: string | null; email: string | null; role: string | null; created_at: string | null }>
  courses: Array<{ id: string; title: string; teacher_id: string | null; is_published: boolean | null; created_at: string | null }>
  enrollments: Array<{ id: string; student_id: string | null; course_id: string | null; status: string | null; enrolled_at: string | null }>
  jobPosts: JobPostRecord[]
  contactInquiries: Array<{ id: string; name: string; email: string; subject: string; created_at: string }>
  resumeSubmissions: Array<{ id: string; full_name: string; email: string; job_category: string; created_at: string }>
}

export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = getSupabaseBrowserAuthClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signUpWithRole(params: {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  role: "student" | "teacher" | "employee"
}) {
  const supabase = getSupabaseBrowserAuthClient()
  const normalizedEmail = params.email.trim().toLowerCase()
  const assignedRole = params.role
  const approvalStatus = assignedRole === "student" ? "approved" : "pending"

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        role: assignedRole,
      },
    },
  })
  if (error) throw error

  const signedUpUser = data.user
  if (!signedUpUser) return

  const { error: profileError } = await supabase.from("users").upsert({
    id: signedUpUser.id,
    email: normalizedEmail,
    full_name: params.fullName,
    phone_number: params.phoneNumber ?? "",
    role: assignedRole,
    approval_status: approvalStatus,
    updated_at: new Date().toISOString(),
  })
  if (profileError) throw profileError
}

export async function signOutPortal() {
  const supabase = getSupabaseBrowserAuthClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentPortalUser() {
  const supabase = getSupabaseBrowserAuthClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export async function getCurrentPortalRole(): Promise<PortalRole> {
  const user = await getCurrentPortalUser()
  if (!user) return "unknown"

  const supabase = getSupabaseBrowserAuthClient()
  const { data, error } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle()
  if (error) throw error

  const role = data?.role?.toString().toLowerCase()
  if (role === "student" || role === "teacher" || role === "employee") return role
  return "unknown"
}

export async function createEmployeeJobPost(input: EmployeeJobInput) {
  const supabase = getSupabaseBrowserAuthClient()
  const { error } = await supabase.from("job_posts").insert({
    company_name: input.company_name,
    job_title: input.job_title,
    location: input.location,
    category: input.category,
    job_type: input.job_type,
    salary: input.salary ?? null,
    description: input.description,
    requirements: input.requirements,
    contact_email: input.contact_email,
    contact_phone: input.contact_phone ?? null,
    source: "employee_portal",
    status: "active",
  })
  if (error) throw error
}

export async function getEmployeeJobPosts(contactEmail?: string | null): Promise<JobPostRecord[]> {
  const supabase = getSupabaseBrowserAuthClient()
  let query = supabase
    .from("job_posts")
    .select(
      "id, company_name, job_title, location, category, job_type, salary, description, requirements, contact_email, contact_phone, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100)

  if (contactEmail && contactEmail.trim().length > 0) {
    query = query.eq("contact_email", contactEmail.trim())
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as JobPostRecord[]
}

export async function getCurrentUserProfile(userId: string): Promise<UserProfileLite | null> {
  const supabase = getSupabaseBrowserAuthClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, phone_number, role, experience, qualifications, demo_video_url, approval_status")
    .eq("id", userId)
    .maybeSingle()
  if (error) throw error
  return (data as UserProfileLite | null) ?? null
}

export async function updateCurrentUserProfile(
  userId: string,
  patch: Partial<Pick<UserProfileLite, "full_name" | "email" | "phone_number" | "experience" | "qualifications" | "demo_video_url">>,
) {
  const supabase = getSupabaseBrowserAuthClient()
  const payload = {
    ...patch,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from("users").update(payload).eq("id", userId)
  if (error) throw error
}

export async function getStudentDashboardData(userId: string): Promise<StudentDashboardData> {
  const supabase = getSupabaseBrowserAuthClient()

  const [coursesRes, enrollmentsRes, jobsRes] = await Promise.all([
    supabase
      .from("courses")
      .select(
        "id, title, description, category, level, duration_hours, estimated_duration, price, is_published, teacher_id, created_at",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    supabase.from("enrollments").select("id, course_id, status, enrolled_at").eq("student_id", userId).order("enrolled_at", { ascending: false }),
    supabase
      .from("job_posts")
      .select(
        "id, company_name, job_title, location, category, job_type, salary, description, requirements, contact_email, contact_phone, status, created_at",
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(20),
  ])

  if (coursesRes.error) throw coursesRes.error
  if (enrollmentsRes.error) throw enrollmentsRes.error

  const enrollments = (enrollmentsRes.data ?? []) as EnrollmentLite[]
  const enrollmentIds = enrollments.map((item) => item.id)

  let progressByEnrollmentId: Record<string, ProgressLite> = {}
  if (enrollmentIds.length > 0) {
    const progressRes = await supabase
      .from("progress")
      .select("enrollment_id, completion_percentage, lessons_completed, total_lessons")
      .in("enrollment_id", enrollmentIds)

    if (!progressRes.error) {
      const map: Record<string, ProgressLite> = {}
      for (const row of (progressRes.data ?? []) as ProgressLite[]) {
        map[row.enrollment_id] = row
      }
      progressByEnrollmentId = map
    }
  }

  return {
    courses: (coursesRes.data ?? []) as CourseLite[],
    enrollments,
    progressByEnrollmentId,
    jobs: ((jobsRes.data ?? []) as JobPostRecord[]) ?? [],
  }
}

export async function getTeacherDashboardData(userId: string): Promise<TeacherDashboardData> {
  const supabase = getSupabaseBrowserAuthClient()
  const coursesRes = await supabase
    .from("courses")
    .select(
      "id, title, description, category, level, duration_hours, estimated_duration, price, is_published, teacher_id, created_at",
    )
    .eq("teacher_id", userId)
    .order("created_at", { ascending: false })

  if (coursesRes.error) throw coursesRes.error
  const courses = (coursesRes.data ?? []) as CourseLite[]
  const courseIds = courses.map((course) => course.id)

  let totalEnrollments = 0
  let totalStudents = 0
  let completedEnrollments = 0
  let totalEarnings = 0
  let monthlyEarnings = 0

  if (courseIds.length > 0) {
    const enrollmentsRes = await supabase
      .from("enrollments")
      .select("id, course_id, student_id, status, enrolled_at")
      .in("course_id", courseIds)

    if (!enrollmentsRes.error) {
      const enrollments = (enrollmentsRes.data ?? []) as Array<{
        id: string
        course_id: string
        student_id: string | null
        status: string | null
        enrolled_at: string | null
      }>

      totalEnrollments = enrollments.length
      totalStudents = new Set(enrollments.map((item) => item.student_id).filter(Boolean)).size
      completedEnrollments = enrollments.filter((item) => item.status === "completed").length

      const coursePriceMap = new Map(courses.map((course) => [course.id, course.price ?? 0]))
      const now = new Date()
      for (const enrollment of enrollments) {
        const coursePrice = coursePriceMap.get(enrollment.course_id) ?? 0
        const teacherShare = coursePrice * 0.7
        totalEarnings += teacherShare

        if (enrollment.enrolled_at) {
          const enrolledAt = new Date(enrollment.enrolled_at)
          if (enrolledAt.getFullYear() === now.getFullYear() && enrolledAt.getMonth() === now.getMonth()) {
            monthlyEarnings += teacherShare
          }
        }
      }
    }
  }

  return {
    courses,
    totalCourses: courses.length,
    activeCourses: courses.filter((course) => course.is_published).length,
    totalEnrollments,
    totalStudents,
    completedEnrollments,
    monthlyEarnings,
    totalEarnings,
  }
}

export async function getCourseLessons(courseId: string): Promise<LessonLite[]> {
  const supabase = getSupabaseBrowserAuthClient()
  const { data, error } = await supabase
    .from("lessons")
    .select("id, course_id, title, description, content_url, type, order_index, duration_minutes")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true })
  if (error) throw error
  return (data ?? []) as LessonLite[]
}

export async function createTeacherCourse(userId: string, input: TeacherCourseInput): Promise<CourseLite> {
  const supabase = getSupabaseBrowserAuthClient()
  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: input.title,
      description: input.description,
      teacher_id: userId,
      category: input.category.toLowerCase(),
      level: input.level.toLowerCase(),
      price: input.price,
      duration_hours: input.estimated_duration,
      estimated_duration: input.estimated_duration,
      is_published: input.is_published ?? true,
    })
    .select(
      "id, title, description, category, level, duration_hours, estimated_duration, price, is_published, teacher_id, created_at",
    )
    .single()

  if (error) throw error
  return data as CourseLite
}

export async function updateTeacherCourse(courseId: string, input: Partial<TeacherCourseInput>) {
  const supabase = getSupabaseBrowserAuthClient()
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.title !== undefined) patch.title = input.title
  if (input.description !== undefined) patch.description = input.description
  if (input.category !== undefined) patch.category = input.category.toLowerCase()
  if (input.level !== undefined) patch.level = input.level.toLowerCase()
  if (input.price !== undefined) patch.price = input.price
  if (input.estimated_duration !== undefined) {
    patch.duration_hours = input.estimated_duration
    patch.estimated_duration = input.estimated_duration
  }
  if (input.is_published !== undefined) patch.is_published = input.is_published

  const { error } = await supabase.from("courses").update(patch).eq("id", courseId)
  if (error) throw error
}

export async function updateStudentLessonProgress(params: {
  enrollmentId: string
  studentId: string
  lessonId: string
  progressPercentage: number
  isCompleted: boolean
}) {
  const supabase = getSupabaseBrowserAuthClient()
  const now = new Date().toISOString()

  const { error: lessonProgressError } = await supabase.from("lesson_progress").upsert({
    enrollment_id: params.enrollmentId,
    lesson_id: params.lessonId,
    progress_percentage: params.progressPercentage,
    is_completed: params.isCompleted,
    completed_at: params.isCompleted ? now : null,
    last_accessed_at: now,
  })
  if (lessonProgressError) throw lessonProgressError

  const { data: lessonRows, error: lessonRowsError } = await supabase
    .from("lesson_progress")
    .select("lesson_id, progress_percentage, is_completed")
    .eq("enrollment_id", params.enrollmentId)
  if (lessonRowsError) throw lessonRowsError

  const lessons = lessonRows as Array<{ lesson_id: string; progress_percentage: number; is_completed: boolean }>
  const totalLessons = lessons.length
  const completedLessons = lessons.filter((item) => item.is_completed).map((item) => item.lesson_id)
  const avg = totalLessons > 0 ? lessons.reduce((sum, item) => sum + (item.progress_percentage ?? 0), 0) / totalLessons : 0
  const lessonProgressMap: Record<string, number> = {}
  for (const row of lessons) lessonProgressMap[row.lesson_id] = row.progress_percentage ?? 0

  const { error: progressError } = await supabase.from("progress").upsert({
    enrollment_id: params.enrollmentId,
    student_id: params.studentId,
    overall_progress: avg,
    completion_percentage: avg,
    lessons_completed: completedLessons.length,
    total_lessons: totalLessons,
    completed_lessons: completedLessons,
    lesson_progress: lessonProgressMap,
    current_lesson_id: params.lessonId,
    last_accessed_at: now,
  })
  if (progressError) throw progressError
}

export async function getAdminPortalSnapshot(): Promise<AdminSnapshot> {
  const supabase = getSupabaseBrowserAuthClient()

  const [usersRes, coursesRes, enrollmentsRes, jobsRes, inquiriesRes, resumesRes] = await Promise.all([
    supabase.from("users").select("id, full_name, email, role, created_at").order("created_at", { ascending: false }).limit(100),
    supabase
      .from("courses")
      .select("id, title, teacher_id, is_published, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("enrollments")
      .select("id, student_id, course_id, status, enrolled_at")
      .order("enrolled_at", { ascending: false })
      .limit(150),
    supabase
      .from("job_posts")
      .select(
        "id, company_name, job_title, location, category, job_type, salary, description, requirements, contact_email, contact_phone, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("contact_inquiries").select("id, name, email, subject, created_at").order("created_at", { ascending: false }).limit(100),
    supabase
      .from("resume_submissions")
      .select("id, full_name, email, job_category, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  if (usersRes.error) throw usersRes.error
  if (coursesRes.error) throw coursesRes.error
  if (enrollmentsRes.error) throw enrollmentsRes.error

  return {
    users: (usersRes.data ?? []) as AdminSnapshot["users"],
    courses: (coursesRes.data ?? []) as AdminSnapshot["courses"],
    enrollments: (enrollmentsRes.data ?? []) as AdminSnapshot["enrollments"],
    jobPosts: ((jobsRes.data ?? []) as JobPostRecord[]) ?? [],
    contactInquiries: (inquiriesRes.data ?? []) as AdminSnapshot["contactInquiries"],
    resumeSubmissions: (resumesRes.data ?? []) as AdminSnapshot["resumeSubmissions"],
  }
}

export async function getPendingApprovals() {
  const supabase = getSupabaseBrowserAuthClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, approval_status, created_at")
    .in("role", ["teacher", "employee"])
    .eq("approval_status", "pending")
    .order("created_at", { ascending: true })
  if (error) throw error
  return (
    (data ?? []) as Array<{
      id: string
      full_name: string | null
      email: string | null
      role: string | null
      approval_status: string | null
      created_at: string | null
    }>
  )
}

export async function updateUserApprovalStatus(userId: string, status: "approved" | "rejected") {
  const supabase = getSupabaseBrowserAuthClient()
  const { error } = await supabase
    .from("users")
    .update({
      approval_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
  if (error) throw error
}



