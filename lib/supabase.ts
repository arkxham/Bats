import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgggsudeipsyfcszouil.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a singleton for client-side usage
let clientSingleton: typeof supabase | null = null

export function getSupabaseBrowser() {
  if (!clientSingleton) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgggsudeipsyfcszouil.supabase.co"
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!key) {
      console.error("Missing Supabase anon key. Please check your environment variables.")
      throw new Error("Missing Supabase anon key")
    }

    console.log("Initializing Supabase browser client with URL:", url)

    clientSingleton = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return clientSingleton
}

// Create a server-side client
export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgggsudeipsyfcszouil.supabase.co"
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseServiceKey) {
    console.error("Missing Supabase service key. Please check your environment variables.")
    // Fall back to the browser client if server keys are not available
    return getSupabaseBrowser()
  }

  console.log("Initializing Supabase server client with URL:", supabaseUrl)

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Helper function to check Supabase connection
export async function checkSupabaseConnection() {
  try {
    const supabase = getSupabaseBrowser()
    const { data, error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Supabase connection successful" }
  } catch (error: any) {
    console.error("Supabase connection test error:", error)
    return { success: false, error: error.message }
  }
}
