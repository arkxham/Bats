import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
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

// Handle both GET and POST requests with the same function
export async function GET(request: Request) {
  return handleUserFilesRequest(request)
}

export async function POST(request: Request) {
  return handleUserFilesRequest(request)
}

// Shared handler function for both GET and POST
async function handleUserFilesRequest(request: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    // Parse the userId from the request
    let userId: string

    if (request.method === "POST") {
      try {
        const body = await request.json()
        userId = body.userId
      } catch (error) {
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
    }

    // Validate inputs
    if (!userId) {
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

    // Update the list of buckets to check to include descriptions
    const buckets = ["profile-picture", "backgrounds", "songs", "descriptions"]
    const userFiles: Record<string, any> = {}
    const timestamp = Date.now() // For cache busting

    // Get files from each bucket
    for (const bucket of buckets) {
      try {
        // List files in the user's folder
        const { data, error } = await supabase.storage.from(bucket).list(userId)

        if (error) {
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
        // Continue with other buckets even if one fails
      }
    }

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
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
