import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    // Validate inputs
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get admin Supabase client
    const supabase = getSupabaseServer()

    // Update the list of buckets to check to include songs
    const buckets = ["profile-picture", "backgrounds", "songs", "descriptions"]
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

    // Extract bio file
    if (userFiles["descriptions"] && userFiles["descriptions"].length > 0) {
      // Find the bio file
      const bioFile = userFiles["descriptions"].find((file: any) => file.name === "bio.txt")

      if (bioFile) {
        // Add the bio file to the response
        userFiles["bio"] = [bioFile]
      }
    }

    return NextResponse.json({
      success: true,
      files: userFiles,
    })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
