import { createClient } from "@supabase/supabase-js"

export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgggsudeipsyfcszouil.supabase.co"
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseServiceKey) {
    console.error("Missing Supabase service key. Please check your environment variables.")
    throw new Error("Missing Supabase service key")
  }

  console.log("Initializing Supabase server client with URL:", supabaseUrl)

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}
