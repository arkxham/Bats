import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  console.log("[user-files] OPTIONS request received")
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

// Make sure we handle both GET and POST methods
export async function GET(request: Request) {
  console.log("[user-files] GET request received")
  return handleUserFilesRequest(request)
}

export async function POST(request: Request) {
  console.log("[user-files] POST request received")
  return handleUserFilesRequest(request)
}

// Common handler function for both GET and POST
async function handleUserFilesRequest(request: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    console.log(`[user-files] Request received: ${request.method}`, {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    })

    // Parse the userId from the request
    let userId: string

    if (request.method === "POST") {
      try {
        const body = await request.json()
        userId = body.userId
        console.log("[user-files] Request body parsed successfully:", body)
      } catch (error) {
        console.error("[user-files] Error parsing request body:", error)
        return NextResponse.json(
          { error: "Invalid request body" },
          {
            status: 400,
            headers: corsHeaders,
          },
        )
      }
    } else {
      // For GET requests, try to get userId from URL params
      const url = new URL(request.url)
      userId = url.searchParams.get("userId") || ""
      console.log("[user-files] GET params parsed:", { userId })
    }

    // Validate inputs
    if (!userId) {
      console.error("[user-files] Missing userId in request")
      return NextResponse.json(
        { error: "User ID is required" },
        {
          status: 400,
          headers: corsHeaders,
        },
      )
    }

    // Get admin Supabase client
    const supabase = getSupabaseServer()
    console.log("[user-files] Supabase client initialized")

    // Test the Supabase connection first
    try {
      const { data: testData, error: testError } = await supabase
        .from("profiles")
        .select("count", { count: "exact", head: true })

      if (testError) {
        console.error("[user-files] Supabase connection test failed:", testError)
        return NextResponse.json(
          { error: `Supabase connection failed: ${testError.message}` },
          {
            status: 500,
            headers: corsHeaders,
          },
        )
      }

      console.log("[user-files] Supabase connection test successful")
    } catch (testError: any) {
      console.error("[user-files] Supabase connection test error:", testError)
      return NextResponse.json(
        { error: `Supabase connection error: ${testError.message}` },
        {
          status: 500,
          headers: corsHeaders,
        },
      )
    }

    // Update the list of buckets to check to include songs
    const buckets = ["profile-picture", "backgrounds", "songs"]
    const userFiles: Record<string, any> = {}
    const timestamp = Date.now() // For cache busting

    // Get files from each bucket
    for (const bucket of buckets) {
      try {
        console.log(`[user-files] Listing files in ${bucket} for user ${userId}`)
        // List files in the user's folder
        const { data, error } = await supabase.storage.from(bucket).list(userId)

        if (error) {
          console.error(`[user-files] Error listing files in ${bucket}:`, error)
          continue
        }

        console.log(`[user-files] Found ${data?.length || 0} files in ${bucket} for user ${userId}`)

        // Get public URLs for each file
        const files = (data || []).map((file) => {
          const filePath = `${userId}/${file.name}`
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

          return {
            ...file,
            publicUrl: `${urlData.publicUrl}?t=${timestamp}`,
            path: filePath,
            bucket,
          }
        })

        userFiles[bucket] = files
      } catch (error: any) {
        console.error(`[user-files] Error getting files from ${bucket}:`, error.message)
      }
    }

    console.log(`[user-files] Successfully retrieved files for user ${userId}`)

    return NextResponse.json(
      {
        success: true,
        files: userFiles,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error("[user-files] Server error in /api/user-files:", error)
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
