import { NextResponse } from "next/server"
import { checkSupabaseConnection, getSupabaseServer } from "@/lib/supabase"

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export async function GET() {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    // Test the Supabase connection
    const connectionTest = await checkSupabaseConnection()

    // Get the Supabase URL from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgggsudeipsyfcszouil.supabase.co"

    // Check if we can list buckets
    const supabase = getSupabaseServer()
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    return NextResponse.json(
      {
        success: true,
        connectionTest,
        supabaseUrl,
        buckets: bucketsError ? { error: bucketsError.message } : { count: buckets?.length || 0 },
        timestamp: new Date().toISOString(),
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error("Error testing Supabase connection:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
