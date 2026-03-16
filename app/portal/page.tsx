import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import PortalClient from "../components/PortalClient"

export default function PortalPage({
  searchParams,
}: {
  searchParams?: { mode?: "login" | "register" | string }
}) {
  const modeRaw = searchParams?.mode
  const initialMode = modeRaw === "register" ? "register" : "login"
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
            Unified Portal
          </h1>
          <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto">
            Student, Teacher, and Employee views powered by the same Supabase backend used by the mobile app.
          </p>
        </div>
        <PortalClient initialMode={initialMode} />
      </main>
      <HomeFooter />
    </div>
  )
}
