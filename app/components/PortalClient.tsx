"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  Bell,
  BookOpen,
  Briefcase,
  Clock3,
  Home,
  Pencil,
  Plus,
  Save,
  Search,
  User,
  Users,
  X,
} from "lucide-react"
import type { JobPostRecord } from "@/lib/jobs"
import {
  createEmployeeJobPost,
  createTeacherCourse,
  getPendingApprovals,
  getAdminPortalSnapshot,
  getCourseLessons,
  getCurrentPortalRole,
  getCurrentPortalUser,
  getEmployeeJobPosts,
  getCurrentUserProfile,
  getStudentDashboardData,
  getTeacherDashboardData,
  signInWithEmailPassword,
  signUpWithRole,
  signOutPortal,
  updateCurrentUserProfile,
  updateStudentLessonProgress,
  updateTeacherCourse,
  updateUserApprovalStatus,
  type AdminSnapshot,
  type CourseLite,
  type EmployeeJobInput,
  type EnrollmentLite,
  type LessonLite,
  type PortalRole,
  type ProgressLite,
  type StudentDashboardData,
  type TeacherCourseInput,
  type TeacherDashboardData,
  type UserProfileLite,
} from "@/lib/portal"
import { isSupabaseConfigured } from "@/lib/supabase"

type LoadState = "checking" | "login" | "ready"
type RoleTab = "home" | "courses" | "jobs" | "profile"

const newsItems = [
  { category: "Biology", title: "The Effects of Temperature on Enzyme Activity and Biology", meta: "1 hour ago - 4795" },
  { category: "Mathematics", title: "How to Work Out a Percentage Using a Calculator", meta: "24 August 2020 - 4795" },
]

const initialCourseForm: TeacherCourseInput = {
  title: "",
  description: "",
  category: "technology",
  level: "beginner",
  price: 0,
  estimated_duration: 1,
  is_published: true,
}

const initialEmployeeJobForm: EmployeeJobInput = {
  company_name: "",
  job_title: "",
  location: "",
  category: "",
  job_type: "",
  salary: "",
  description: "",
  requirements: [],
  contact_email: "",
  contact_phone: "",
}

function title(v: string) {
  return v
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ")
}
const dur = (c: CourseLite) => c.estimated_duration ?? c.duration_hours ?? 0
const findEnrollment = (list: EnrollmentLite[], courseId: string) => list.find((i) => i.course_id === courseId)
const progressOf = (map: Record<string, ProgressLite>, enrollmentId?: string) => (enrollmentId ? map[enrollmentId] : null)

export default function PortalClient({ initialMode }: { initialMode?: "login" | "register" }) {
  const [state, setState] = useState<LoadState>("checking")
  const MAIN_ADMIN_EMAIL = (process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL ?? "").toLowerCase()
  const MAIN_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_MAIN_ADMIN_PASSWORD ?? ""
  const [authMode, setAuthMode] = useState<"login" | "register">(initialMode === "register" ? "register" : "login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerRole, setRegisterRole] = useState<"student" | "teacher" | "employee">("student")
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  const [role, setRole] = useState<PortalRole>("unknown")
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [tab, setTab] = useState<RoleTab>("home")

  const [studentData, setStudentData] = useState<StudentDashboardData | null>(null)
  const [teacherData, setTeacherData] = useState<TeacherDashboardData | null>(null)
  const [adminData, setAdminData] = useState<AdminSnapshot | null>(null)
  const [pendingApprovals, setPendingApprovals] = useState<Array<{ id: string; full_name: string | null; email: string | null; role: string | null; approval_status: string | null; created_at: string | null }>>([])
  const [employeeJobs, setEmployeeJobs] = useState<JobPostRecord[]>([])
  const [profile, setProfile] = useState<UserProfileLite | null>(null)

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<string, LessonLite[]>>({})

  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [courseForm, setCourseForm] = useState<TeacherCourseInput>(initialCourseForm)
  const [employeeJobForm, setEmployeeJobForm] = useState<EmployeeJobInput>(initialEmployeeJobForm)
  const [employeeRequirementsInput, setEmployeeRequirementsInput] = useState("")

  const refreshData = useCallback(
    async (currentRole: PortalRole, uid: string) => {
      const userProfile = await getCurrentUserProfile(uid)
      setProfile(userProfile)
      if (currentRole === "student") setStudentData(await getStudentDashboardData(uid))
      if (currentRole === "teacher") setTeacherData(await getTeacherDashboardData(uid))
      if (currentRole === "employee") {
        setEmployeeJobs(await getEmployeeJobPosts(userProfile?.email))
        setEmployeeJobForm((prev) => ({ ...prev, contact_email: userProfile?.email ?? prev.contact_email }))
      }
      if (currentRole === "admin") {
        setAdminData(await getAdminPortalSnapshot())
        if (MAIN_ADMIN_EMAIL && (userProfile?.email ?? "").toLowerCase() === MAIN_ADMIN_EMAIL) {
          setPendingApprovals(await getPendingApprovals())
        } else {
          setPendingApprovals([])
        }
      }
    },
    [],
  )

  const bootstrap = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setState("login")
      setError("Supabase not configured")
      return
    }
    try {
      setState("checking")
      const user = await getCurrentPortalUser()
      if (!user) {
        setState("login")
        return
      }
      const r = await getCurrentPortalRole()
      setRole(r)
      setUserId(user.id)
      setUserName((user.user_metadata?.full_name as string) ?? "")
      setTab("home")
      setSelectedCourseId(null)
      await refreshData(r, user.id)
      setState("ready")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
      setState("login")
    }
  }, [refreshData])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const isMainAdminLogin = MAIN_ADMIN_EMAIL && normalizedEmail === MAIN_ADMIN_EMAIL && password === MAIN_ADMIN_PASSWORD
      await signInWithEmailPassword(normalizedEmail, password)
      setError("")

      if (isMainAdminLogin) {
        const user = await getCurrentPortalUser()
        if (!user) throw new Error("Admin session not found")
        setRole("admin")
        setUserId(user.id)
        setUserName((user.user_metadata?.full_name as string) ?? "")
        setTab("home")
        setSelectedCourseId(null)
        await refreshData("admin", user.id)
        setState("ready")
        return
      }

      await bootstrap()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  const register = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError("")
      const normalizedEmail = email.trim().toLowerCase()
      await signUpWithRole({
        email: normalizedEmail,
        password,
        fullName: registerName.trim() || "User",
        phoneNumber: registerPhone.trim(),
        role: registerRole,
      })
      if (MAIN_ADMIN_EMAIL && normalizedEmail === MAIN_ADMIN_EMAIL) {
        setError("This email is reserved for direct admin login.")
        return
      }
      if (registerRole === "student") {
        setMsg("Student account created. You can login now.")
      } else {
        setMsg("Account created. Waiting for main admin approval.")
      }
      setAuthMode("login")
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    }
  }

  const logout = async () => {
    await signOutPortal()
    setState("login")
    setRole("unknown")
  }

  const loadLessons = async (courseId: string) => {
    if (lessonsByCourse[courseId]) return
    const lessons = await getCourseLessons(courseId)
    setLessonsByCourse((p) => ({ ...p, [courseId]: lessons }))
  }

  const selectedCourse = useMemo(() => {
    if (role === "student") return studentData?.courses.find((c) => c.id === selectedCourseId) ?? null
    if (role === "teacher") return teacherData?.courses.find((c) => c.id === selectedCourseId) ?? null
    return null
  }, [role, selectedCourseId, studentData, teacherData])

  const saveProfile = async () => {
    if (!profile || !userId) return
    await updateCurrentUserProfile(userId, profile)
    setMsg("Profile updated")
    await refreshData(role, userId)
  }

  const completeLesson = async (courseId: string, lessonId: string) => {
    if (!studentData || !userId) return
    const en = findEnrollment(studentData.enrollments, courseId)
    if (!en) return
    await updateStudentLessonProgress({
      enrollmentId: en.id,
      studentId: userId,
      lessonId,
      progressPercentage: 100,
      isCompleted: true,
    })
    setMsg("Lesson marked complete")
    setStudentData(await getStudentDashboardData(userId))
  }

  const saveCourse = async () => {
    if (!userId) return
    if (editingCourseId) await updateTeacherCourse(editingCourseId, courseForm)
    else await createTeacherCourse(userId, courseForm)
    setShowCourseForm(false)
    setEditingCourseId(null)
    setCourseForm(initialCourseForm)
    setMsg(editingCourseId ? "Course updated" : "Course created")
    setTeacherData(await getTeacherDashboardData(userId))
  }

  const postEmployeeJob = async () => {
    if (!employeeJobForm.company_name || !employeeJobForm.job_title || !employeeJobForm.location || !employeeJobForm.category || !employeeJobForm.job_type || !employeeJobForm.description || !employeeJobForm.contact_email) {
      setError("Fill all required job fields")
      return
    }
    await createEmployeeJobPost(employeeJobForm)
    setEmployeeJobForm((prev) => ({ ...initialEmployeeJobForm, contact_email: prev.contact_email }))
    setEmployeeRequirementsInput("")
    setMsg("Job posted successfully")
    if (profile?.email) setEmployeeJobs(await getEmployeeJobPosts(profile.email))
  }

  const reviewPendingUser = async (targetUserId: string, status: "approved" | "rejected") => {
    await updateUserApprovalStatus(targetUserId, status)
    setMsg(status === "approved" ? "User approved" : "User rejected")
    if (MAIN_ADMIN_EMAIL && profile?.email?.toLowerCase() === MAIN_ADMIN_EMAIL) {
      setPendingApprovals(await getPendingApprovals())
    }
  }

  if (state === "checking") return <AppCard>Loading role workspace...</AppCard>

  if (state === "login")
    return (
      <AppCard>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-2">{authMode === "login" ? "Role Login" : "Register Account"}</h2>
          <p className="text-sm text-gray-600 mb-3">Use the same backend account from app.</p>
          <div className="mb-3 flex gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${authMode === "login" ? "bg-blue-900 text-white" : "bg-gray-100"}`}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${authMode === "register" ? "bg-blue-900 text-white" : "bg-gray-100"}`}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>
          {error && <p className="mb-2 text-sm text-red-700">{error}</p>}
          <form onSubmit={authMode === "login" ? login : register} className="space-y-2">
            {authMode === "register" && (
              <>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Full Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Phone Number"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                />
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value as "student" | "teacher" | "employee")}
                >
                  <option value="student">student (auto approved)</option>
                  <option value="teacher">teacher (admin approval required)</option>
                  <option value="employee">employee (admin approval required)</option>
                </select>
              </>
            )}
            <input className="w-full border rounded-md px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input
              className="w-full border rounded-md px-3 py-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-blue-900 text-white rounded-md px-3 py-2">{authMode === "login" ? "Login" : "Register"}</button>
          </form>
          {authMode === "register" && (
            <p className="mt-2 text-xs text-gray-500">
              Student accounts are active immediately. Teacher and employee accounts stay pending until main admin approval.
            </p>
          )}
        </div>
      </AppCard>
    )

  const courses = role === "student" ? studentData?.courses ?? [] : teacherData?.courses ?? []
  const lessons = selectedCourse ? lessonsByCourse[selectedCourse.id] ?? [] : []
  const isPendingRestrictedRole =
    role !== "student" &&
    role !== "unknown" &&
    role !== "admin" &&
    (profile?.approval_status ?? "approved") !== "approved"

  return (
    <div className="space-y-4">
      <AppCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
            <p className="font-semibold text-lg">{role}</p>
          </div>
          <button className="border rounded-md px-3 py-2 text-sm hover:bg-gray-50" onClick={logout}>
            Logout
          </button>
        </div>
      </AppCard>

      {msg && <AppCard>{msg}</AppCard>}

      {isPendingRestrictedRole && (
        <AppCard>
          <p className="text-amber-800">
            Your `{role}` account is pending approval from main admin ({MAIN_ADMIN_EMAIL || 'main admin'}).
          </p>
        </AppCard>
      )}

      {role !== "admin" && (
        <AppCard>
          <div className="flex gap-2">
            {(role === "employee" ? (["home", "jobs", "profile"] as RoleTab[]) : (["home", "courses", "profile"] as RoleTab[])).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === t ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {title(t)}
              </button>
            ))}
          </div>
        </AppCard>
      )}

      {role === "student" && tab === "home" && studentData && (
        <StudentHome name={profile?.full_name || userName || "Student"} courses={studentData.courses} jobs={studentData.jobs} enrollments={studentData.enrollments} />
      )}

      {role === "student" && tab === "courses" && studentData && (
        <AppCard title="Student Courses">
          <CourseList
            courses={studentData.courses}
            progressByEnrollment={studentData.progressByEnrollmentId}
            enrollments={studentData.enrollments}
            onOpen={async (course) => {
              setSelectedCourseId(course.id)
              await loadLessons(course.id)
            }}
          />
          {selectedCourse && (
            <CourseDetail
              course={selectedCourse}
              lessons={lessons}
              onClose={() => setSelectedCourseId(null)}
              actionLabel="Complete"
              onAction={(lessonId) => completeLesson(selectedCourse.id, lessonId)}
            />
          )}
        </AppCard>
      )}

      {role === "teacher" && !isPendingRestrictedRole && tab === "home" && teacherData && (
        <TeacherHome name={profile?.full_name || userName || "Teacher"} data={teacherData} />
      )}

      {role === "teacher" && !isPendingRestrictedRole && tab === "courses" && teacherData && (
        <AppCard title="Teacher Courses">
          <div className="flex items-center justify-end mb-3">
            <button
              className="bg-blue-900 text-white rounded-md px-3 py-2 text-sm inline-flex items-center gap-1"
              onClick={() => {
                setEditingCourseId(null)
                setCourseForm(initialCourseForm)
                setShowCourseForm(true)
              }}
            >
              <Plus className="h-4 w-4" /> Make a Class
            </button>
          </div>

          <div className="space-y-3">
            {teacherData.courses.map((course) => (
              <div key={course.id} className="border rounded-xl p-3">
                <div className="flex gap-3">
                  <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {title(course.category || "general")} - {title(course.level || "beginner")} - {course.is_published ? "Published" : "Draft"}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        className="border rounded-md px-2 py-1 text-sm"
                        onClick={async () => {
                          setSelectedCourseId(course.id)
                          await loadLessons(course.id)
                        }}
                      >
                        View
                      </button>
                      <button
                        className="border rounded-md px-2 py-1 text-sm inline-flex items-center gap-1"
                        onClick={() => {
                          setEditingCourseId(course.id)
                          setCourseForm({
                            title: course.title,
                            description: course.description ?? "",
                            category: course.category ?? "technology",
                            level: course.level ?? "beginner",
                            price: course.price ?? 0,
                            estimated_duration: dur(course),
                            is_published: !!course.is_published,
                          })
                          setShowCourseForm(true)
                        }}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button
                        className="border rounded-md px-2 py-1 text-sm"
                        onClick={async () => {
                          await updateTeacherCourse(course.id, { is_published: !course.is_published })
                          setTeacherData(await getTeacherDashboardData(userId))
                        }}
                      >
                        {course.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedCourse && (
            <CourseDetail
              course={selectedCourse}
              lessons={lessons}
              onClose={() => setSelectedCourseId(null)}
              actionLabel=""
              onAction={() => {}}
            />
          )}

          {showCourseForm && (
            <TeacherCourseForm
              form={courseForm}
              setForm={setCourseForm}
              onClose={() => setShowCourseForm(false)}
              onSave={saveCourse}
              editing={Boolean(editingCourseId)}
            />
          )}
        </AppCard>
      )}

      {role === "employee" && !isPendingRestrictedRole && tab === "home" && (
        <EmployeeHome name={profile?.full_name || userName || "Employee"} jobsCount={employeeJobs.length} />
      )}

      {role === "employee" && !isPendingRestrictedRole && tab === "jobs" && (
        <EmployeeJobs
          form={employeeJobForm}
          requirementsInput={employeeRequirementsInput}
          jobs={employeeJobs}
          onFormChange={setEmployeeJobForm}
          onReqInputChange={setEmployeeRequirementsInput}
          onAddRequirement={() => {
            const value = employeeRequirementsInput.trim()
            if (!value) return
            setEmployeeJobForm({ ...employeeJobForm, requirements: [...employeeJobForm.requirements, value] })
            setEmployeeRequirementsInput("")
          }}
          onPost={postEmployeeJob}
        />
      )}

      {(role === "student" || role === "teacher" || role === "employee") && tab === "profile" && profile && (
        <ProfileForm profile={profile} setProfile={setProfile} onSave={saveProfile} />
      )}

      {role === "admin" && <AdminOverview data={adminData} />}
      {role === "admin" && MAIN_ADMIN_EMAIL && (profile?.email ?? "").toLowerCase() === MAIN_ADMIN_EMAIL && (
        <AdminApprovalPanel pending={pendingApprovals} onReview={reviewPendingUser} />
      )}
      {role === "unknown" && <AppCard>Set users.role to student, teacher, or employee.</AppCard>}

      {(role === "student" || role === "teacher" || role === "employee") && <RoleBottomNav tab={tab} role={role} />}
    </div>
  )
}

function StudentHome({ name, courses, jobs, enrollments }: { name: string; courses: CourseLite[]; jobs: JobPostRecord[]; enrollments: EnrollmentLite[] }) {
  return (
    <div className="space-y-4 text-gray-900">
      <AppCard>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-semibold">Hi, {name}</h3>
            <p className="text-gray-600">What do you want to learn today?</p>
          </div>
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
        <div className="mt-4 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center px-3 text-gray-500">
          <Search className="h-4 w-4 mr-2" /> Search
        </div>
      </AppCard>
      <AppCard title="Recent learning">{enrollments.slice(0, 4).map((e) => <p key={e.id}>- {courses.find((c) => c.id === e.course_id)?.title ?? "Course"}</p>)}</AppCard>
      <AppCard title="Recommended">{courses.slice(0, 6).map((c) => <p key={c.id}>- {c.title}</p>)}</AppCard>
      <AppCard title="Job Opportunities">{jobs.slice(0, 6).map((j) => <p key={j.id}>- {j.job_title} ({j.company_name})</p>)}</AppCard>
      <AppCard title="Latest News">{newsItems.map((n) => <p key={n.title}>- {n.title}</p>)}</AppCard>
    </div>
  )
}

function TeacherHome({ name, data }: { name: string; data: TeacherDashboardData }) {
  return (
    <div className="space-y-4 text-gray-900">
      <AppCard>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-semibold">Hi, {name}</h3>
            <p className="text-gray-600">What do you want to teach today?</p>
          </div>
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
        <div className="mt-4 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center px-3 text-gray-500">
          <Search className="h-4 w-4 mr-2" /> Search
        </div>
      </AppCard>
      <AppCard title="Lesson Progress">{data.courses.slice(0, 4).map((c) => <p key={c.id}>- {c.title}</p>)}</AppCard>
      <AppCard title="Statistic">
        <Metric icon={<BookOpen className="h-4 w-4" />} label="Your Course" value={data.totalCourses.toString()} />
        <Metric icon={<Users className="h-4 w-4" />} label="Audience" value={data.totalStudents.toString()} />
        <Metric icon={<Clock3 className="h-4 w-4" />} label="Enrollments" value={data.totalEnrollments.toString()} />
        <Metric icon={<Briefcase className="h-4 w-4" />} label="Completed" value={data.completedEnrollments.toString()} />
      </AppCard>
      <AppCard title="Revenue">
        <p>Monthly Earnings: Rs {data.monthlyEarnings.toFixed(0)}</p>
        <p>Total Earnings: Rs {data.totalEarnings.toFixed(0)}</p>
      </AppCard>
    </div>
  )
}

function EmployeeHome({ name, jobsCount }: { name: string; jobsCount: number }) {
  return (
    <div className="space-y-4 text-gray-900">
      <AppCard>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-semibold">Hi, {name}</h3>
            <p className="text-gray-600">What opportunities do you want to post today?</p>
          </div>
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
        <div className="mt-4 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center px-3 text-gray-500">
          <Search className="h-4 w-4 mr-2" /> Search
        </div>
      </AppCard>
      <AppCard title="Job Posting Overview">
        <Metric icon={<Briefcase className="h-4 w-4" />} label="Active Job Posts" value={jobsCount.toString()} />
        <p className="text-sm text-gray-600 mt-2">Newly posted active jobs are automatically visible in student sections.</p>
      </AppCard>
      <AppCard title="Latest News">{newsItems.map((n) => <p key={n.title}>- {n.title}</p>)}</AppCard>
    </div>
  )
}

function EmployeeJobs({
  form,
  requirementsInput,
  jobs,
  onFormChange,
  onReqInputChange,
  onAddRequirement,
  onPost,
}: {
  form: EmployeeJobInput
  requirementsInput: string
  jobs: JobPostRecord[]
  onFormChange: (next: EmployeeJobInput) => void
  onReqInputChange: (value: string) => void
  onAddRequirement: () => void
  onPost: () => void
}) {
  return (
    <AppCard title="Post Job">
      <div className="grid md:grid-cols-2 gap-2">
        <input className="border rounded-md px-3 py-2" placeholder="Company Name*" value={form.company_name} onChange={(e) => onFormChange({ ...form, company_name: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Job Title*" value={form.job_title} onChange={(e) => onFormChange({ ...form, job_title: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Location*" value={form.location} onChange={(e) => onFormChange({ ...form, location: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Category*" value={form.category} onChange={(e) => onFormChange({ ...form, category: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Job Type*" value={form.job_type} onChange={(e) => onFormChange({ ...form, job_type: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Salary" value={form.salary ?? ""} onChange={(e) => onFormChange({ ...form, salary: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Contact Email*" value={form.contact_email} onChange={(e) => onFormChange({ ...form, contact_email: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Contact Phone" value={form.contact_phone ?? ""} onChange={(e) => onFormChange({ ...form, contact_phone: e.target.value })} />
      </div>
      <textarea className="mt-2 w-full border rounded-md px-3 py-2" rows={3} placeholder="Job Description*" value={form.description} onChange={(e) => onFormChange({ ...form, description: e.target.value })} />
      <div className="mt-2">
        <div className="flex gap-2">
          <input className="flex-1 border rounded-md px-3 py-2" placeholder="Add requirement and press Add" value={requirementsInput} onChange={(e) => onReqInputChange(e.target.value)} />
          <button className="border rounded-md px-3 py-2 text-sm" onClick={onAddRequirement}>
            Add
          </button>
        </div>
        {form.requirements.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.requirements.map((req, idx) => (
              <span key={`${req}-${idx}`} className="px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200">
                {req}
              </span>
            ))}
          </div>
        )}
      </div>
      <button className="mt-3 bg-blue-900 text-white rounded-md px-3 py-2 text-sm inline-flex items-center gap-1" onClick={onPost}>
        <Save className="h-4 w-4" /> Post Job
      </button>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">My Posted Jobs</h4>
        {jobs.length === 0 ? (
          <p className="text-sm text-gray-600">No jobs posted yet.</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-xl p-3">
                <p className="font-medium">{job.job_title} - {job.company_name}</p>
                <p className="text-xs text-gray-600">{job.location} - {job.category} - {job.job_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppCard>
  )
}

function CourseList({
  courses,
  progressByEnrollment,
  enrollments,
  onOpen,
}: {
  courses: CourseLite[]
  progressByEnrollment: Record<string, ProgressLite>
  enrollments: EnrollmentLite[]
  onOpen: (course: CourseLite) => void
}) {
  return (
    <div className="space-y-3">
      {courses.map((course) => {
        const enrollment = findEnrollment(enrollments, course.id)
        const progress = progressOf(progressByEnrollment, enrollment?.id)
        const completion = Math.max(0, Math.min(100, progress?.completion_percentage ?? 0))
        return (
          <div key={course.id} className="border rounded-xl p-3">
            <div className="flex gap-3">
              <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-semibold">{course.title}</p>
                <p className="text-xs text-gray-600 mb-1">
                  {title(course.category || "general")} - {dur(course)}h
                </p>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden mb-1">
                  <div className="h-2 bg-blue-600" style={{ width: `${completion}%` }}></div>
                </div>
                <p className="text-xs text-gray-600">{completion.toFixed(0)}% completed</p>
                <button className="mt-2 border rounded-md px-2 py-1 text-sm" onClick={() => onOpen(course)}>
                  View Learning
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CourseDetail({
  course,
  lessons,
  onClose,
  actionLabel,
  onAction,
}: {
  course: CourseLite
  lessons: LessonLite[]
  onClose: () => void
  actionLabel: string
  onAction: (lessonId: string) => void
}) {
  return (
    <div className="mt-3 border rounded-xl p-0 overflow-hidden">
      <div className="h-36 bg-gradient-to-br from-blue-500 to-blue-700 relative">
        <button onClick={onClose} className="absolute right-3 top-3 rounded-full bg-white/90 p-1">
          <X className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-lg">{course.title}</h4>
        <p className="text-sm text-gray-600 mb-3">{course.description || "No description"}</p>
        {lessons.length === 0 ? (
          <p className="text-sm text-gray-600">No lessons found.</p>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} className="border rounded-md p-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {idx + 1}. {lesson.title}
                  </p>
                  <p className="text-xs text-gray-600">{lesson.duration_minutes ?? 0} min</p>
                </div>
                {actionLabel && (
                  <button className="bg-blue-900 text-white rounded-md px-2 py-1 text-xs" onClick={() => onAction(lesson.id)}>
                    {actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TeacherCourseForm({
  form,
  setForm,
  onClose,
  onSave,
  editing,
}: {
  form: TeacherCourseInput
  setForm: (next: TeacherCourseInput) => void
  onClose: () => void
  onSave: () => void
  editing: boolean
}) {
  return (
    <div className="mt-3 border rounded-xl p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{editing ? "Edit Course" : "Create Course"}</h4>
        <button onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <input className="border rounded-md px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
        <input type="number" className="border rounded-md px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value || 0) })} />
        <input
          type="number"
          className="border rounded-md px-3 py-2"
          placeholder="Duration"
          value={form.estimated_duration}
          onChange={(e) => setForm({ ...form, estimated_duration: Number(e.target.value || 1) })}
        />
      </div>
      <textarea className="mt-2 w-full border rounded-md px-3 py-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button className="mt-2 bg-blue-900 text-white rounded-md px-3 py-2 text-sm inline-flex items-center gap-1" onClick={onSave}>
        <Save className="h-4 w-4" /> {editing ? "Save Changes" : "Create Course"}
      </button>
    </div>
  )
}

function ProfileForm({
  profile,
  setProfile,
  onSave,
}: {
  profile: UserProfileLite
  setProfile: (profile: UserProfileLite) => void
  onSave: () => void
}) {
  return (
    <AppCard title="Profile">
      <div className="grid md:grid-cols-2 gap-2">
        <input className="border rounded-md px-3 py-2" placeholder="Full name" value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Email" value={profile.email ?? ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Phone" value={profile.phone_number ?? ""} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Experience" value={profile.experience ?? ""} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
        <input className="border rounded-md px-3 py-2" placeholder="Qualifications" value={profile.qualifications ?? ""} onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })} />
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Demo video URL"
          value={profile.demo_video_url ?? ""}
          onChange={(e) => setProfile({ ...profile, demo_video_url: e.target.value })}
        />
      </div>
      <button onClick={onSave} className="mt-2 bg-blue-900 text-white rounded-md px-3 py-2 text-sm inline-flex items-center gap-1">
        <Save className="h-4 w-4" />
        Save Profile
      </button>
    </AppCard>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="border rounded-md p-2 mb-1">
      <div className="flex items-center gap-1 text-xs text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

function AdminOverview({ data }: { data: AdminSnapshot | null }) {
  return (
    <AppCard title="Admin Overview">
      <p>Users: {data?.users.length ?? 0}</p>
      <p>Courses: {data?.courses.length ?? 0}</p>
      <p>Enrollments: {data?.enrollments.length ?? 0}</p>
      <p>Job Posts: {data?.jobPosts.length ?? 0}</p>
      <p>Contact Inquiries: {data?.contactInquiries.length ?? 0}</p>
      <p>Resume Submissions: {data?.resumeSubmissions.length ?? 0}</p>
    </AppCard>
  )
}

function AdminApprovalPanel({
  pending,
  onReview,
}: {
  pending: Array<{ id: string; full_name: string | null; email: string | null; role: string | null; approval_status: string | null; created_at: string | null }>
  onReview: (targetUserId: string, status: "approved" | "rejected") => void
}) {
  return (
    <AppCard title="Pending Role Approvals (Main Admin)">
      {pending.length === 0 ? (
        <p className="text-sm text-gray-600">No pending requests.</p>
      ) : (
        <div className="space-y-2">
          {pending.map((user) => (
            <div key={user.id} className="border rounded-md p-2">
              <p className="font-medium">{user.full_name ?? "User"} ({user.role ?? "unknown"})</p>
              <p className="text-xs text-gray-600">{user.email ?? "-"} - requested {user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</p>
              <div className="mt-2 flex gap-2">
                <button className="px-2 py-1 rounded-md bg-green-600 text-white text-xs" onClick={() => onReview(user.id, "approved")}>
                  Approve
                </button>
                <button className="px-2 py-1 rounded-md bg-red-600 text-white text-xs" onClick={() => onReview(user.id, "rejected")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppCard>
  )
}

function RoleBottomNav({ tab, role }: { tab: RoleTab; role: PortalRole }) {
  const itemClass = (active: boolean) => `flex items-center gap-1 text-sm ${active ? "text-blue-700 font-semibold" : "text-gray-500"}`
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex justify-around">
        <div className={itemClass(tab === "home")}>
          <Home className="h-4 w-4" /> Home
        </div>
        {role === "employee" ? (
          <div className={itemClass(tab === "jobs")}>
            <Briefcase className="h-4 w-4" /> Jobs
          </div>
        ) : (
          <div className={itemClass(tab === "courses")}>
            <BookOpen className="h-4 w-4" /> Courses
          </div>
        )}
        <div className={itemClass(tab === "profile")}>
          <User className="h-4 w-4" /> Profile
        </div>
      </div>
    </div>
  )
}

function AppCard({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-sm">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  )
}





