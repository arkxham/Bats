import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

// CORS headers to use in all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  console.log("[user-files] OPTIONS request received")
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// Handle GET requests
export async function GET(request: Request) {
  console.log("[user-files] GET request received", request.url)

  try {
    // Get userId from URL params
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    console.log("[user-files] GET params:", { userId })

    // Validate inputs
    if (!userId) {
      console.error("[user-files] Missing userId in GET request")
      return NextResponse.json(
        { error: "User ID is required" },
        {
          status: 400,
          headers: corsHeaders,
        },
      )
    }

    // Get files for the user
    const files = await getUserFiles(userId)

    return NextResponse.json(
      {
        success: true,
        files: files,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error("[user-files] Error in GET handler:", error)
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}

// Handle POST requests
export async function POST(request: Request) {
  console.log("[user-files] POST request received")

  try {
    // Parse the userId from the request body
    let userId: string

    try {
      const body = await request.json()
      userId = body.userId
      console.log("[user-files] POST body:", { userId })
    } catch (error) {
      console.error("[user-files] Error parsing POST body:", error)
      return NextResponse.json(
        { error: "Invalid request body" },
        {
          status: 400,
          headers: corsHeaders,
        },
      )
    }

    // Validate inputs
    if (!userId) {
      console.error("[user-files] Missing userId in POST request")
      return NextResponse.json(
        { error: "User ID is required" },
        {
          status: 400,
          headers: corsHeaders,
        },
      )
    }

    // Get files for the user
    const files = await getUserFiles(userId)

    return NextResponse.json(
      {
        success: true,
        files: files,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error("[user-files] Error in POST handler:", error)
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}

// Shared function to get user files from Supabase
async function getUserFiles(userId: string) {
  console.log(`[user-files] Getting files for user: ${userId}`)

  try {
    // Get admin Supabase client
    const supabase = getSupabaseServer()

    // List of buckets to check
    const buckets = ["profile-picture", "backgrounds", "songs", "descriptions"]
    const userFiles: Record<string, any> = {}
    const timestamp = Date.now() // For cache busting

    // Get files from each bucket
    for (const bucket of buckets) {
      try {
        // List files in the user's folder
        const { data, error } = await supabase.storage.from(bucket).list(userId)

        if (error) {
          console.error(`[user-files] Error listing files in ${bucket}:`, error)
          userFiles[bucket] = [] // Set empty array for this bucket
          continue
        }

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
        console.error(`[user-files] Error processing ${bucket}:`, error)
        userFiles[bucket] = [] // Set empty array for this bucket
      }
    }

    return userFiles
  } catch (error: any) {
    console.error(`[user-files] Error getting files for user ${userId}:`, error)
    throw error
  }
}
