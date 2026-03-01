import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const DEFAULT_REQUEST_TIMEOUT_MS = 10000

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let cachedClient: ReturnType<typeof createClient> | null = null
let cachedBrowserAuthClient: ReturnType<typeof createClient> | null = null

export async function withTimeout<T>(
  promise: Promise<T>,
  options: { timeoutMs?: number; label?: string } = {},
): Promise<T> {
  const { timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, label = "Request" } = options
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms.`)), timeoutMs)
      }),
    ])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  return cachedClient
}

export function getSupabaseBrowserAuthClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }
  if (typeof window === "undefined") {
    throw new Error("Browser auth client can only be used in the browser.")
  }

  if (!cachedBrowserAuthClient) {
    cachedBrowserAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return cachedBrowserAuthClient
}
