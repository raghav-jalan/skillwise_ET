"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
  open: boolean
  onClose: () => void
  mode: "login" | "register"
}

function ProviderButton({
  provider,
  label,
  onClick,
}: {
  provider: "google" | "facebook" | "apple"
  label: string
  onClick: () => void
}) {
  const src = provider === "google" ? "/logos/google.png" : provider === "facebook" ? "/logos/facebook.png" : "/logos/apple.png"
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-4 rounded-md border border-black/40 bg-white px-4 py-3 text-sm font-bold text-black hover:bg-gray-50 transition-colors"
    >
      <img src={src} alt="" className="h-5 w-5 object-contain" />
      <span>{label}</span>
    </button>
  )
}

export default function HomeAuthModal({ open, onClose, mode }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-sm hover:bg-white"
        >
          <X className="h-5 w-5 text-gray-900" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 bg-black px-6 py-12 text-white md:px-10">
            <h2 className="text-3xl font-black leading-tight">
              {mode === "login" ? "Welcome Back to SkillUp" : "Join SkillUp for Free"}
            </h2>
            <div className="mt-6 h-1 w-28 rounded-full bg-emerald-400/80" />
            <p className="mt-8 text-sm leading-relaxed text-white/80">
              {mode === "login"
                ? "Sign in to continue your learning across courses, certifications, and the unified portal."
                : "Explore your creativity with thousands of inspiring classes in design, illustration, photography, and more."}
            </p>
          </div>

          <div className="md:col-span-7 px-6 py-10 md:px-10 bg-white">
            <div className="space-y-4">
              <ProviderButton
                provider="facebook"
                label="Continue with Facebook"
                onClick={() => router.push(`/portal?mode=${mode}`)}
              />
              <ProviderButton
                provider="google"
                label="Continue with Google"
                onClick={() => router.push(`/portal?mode=${mode}`)}
              />
              <ProviderButton
                provider="apple"
                label="Continue with Apple"
                onClick={() => router.push(`/portal?mode=${mode}`)}
              />
            </div>

            <div className="mt-6 grid grid-cols-3 items-center gap-3">
              <div className="h-px bg-black/20" />
              <div className="text-center text-sm font-semibold text-gray-600">or</div>
              <div className="h-px bg-black/20" />
            </div>

            <button
              type="button"
              onClick={() => router.push(`/portal?mode=${mode}`)}
              className="mt-6 w-full rounded-md bg-white px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              {mode === "login" ? "Sign In Using Email" : "Sign Up Using Email"}
            </button>

            <div className="mt-6 border-t border-black/10 pt-6 text-center text-sm text-gray-700">
              {mode === "login" ? (
                <>
                  Not a member yet?{" "}
                  <button
                    type="button"
                    className="font-bold text-indigo-700 hover:underline"
                    onClick={() => router.push("/portal?mode=register")}
                  >
                    Sign Up.
                  </button>
                </>
              ) : (
                <>
                  Already a member?{" "}
                  <button
                    type="button"
                    className="font-bold text-indigo-700 hover:underline"
                    onClick={() => router.push("/portal?mode=login")}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            <p className="mt-4 text-center text-[11px] leading-snug text-gray-500">
              By signing up you agree to SkillUp&apos;s Terms of Service and Privacy Policy, and agree to receive marketing
              communications from SkillUp at the email address provided.
            </p>
          </div>
        </div>
      </div>
      <button type="button" onClick={onClose} className="absolute inset-0 -z-10" aria-hidden="true" />
    </div>
  )
}

