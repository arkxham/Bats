import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export async function POST(request: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
  try {
    const { userId } = await request.json()

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

    // Update the list of buckets to check to include songs
    const buckets = ["profile-picture", "backgrounds", "songs"]
    const userFiles: Record<string, any> = {}
    const timestamp = Date.now() // For cache busting

    // Get files from each bucket
    for (const bucket of buckets) {
      try {
        // List files in the user's folder
        const { data, error } = await supabase.storage.from(bucket).list(userId)

        if (error) {
          console.error(`Error listing files in ${bucket}:`, error)
          continue
        }

        // Get public URLs for each file
        const files = data.map((file) => {
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
        console.error(`Error getting files from ${bucket}:`, error.message)
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
    console.error("Server error:", error)
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
