import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, text, fileName, bucket } = await request.json()

    // Validate inputs
    if (!userId || !text || !fileName || !bucket) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: userId, text, fileName, bucket" },
        { status: 400 },
      )
    }

    // Get admin Supabase client
    const supabase = getSupabaseServer()

    // Create the full path
    const filePath = `${userId}/${fileName}`

    // Delete existing file if it exists
    try {
      const { data: existingFiles } = await supabase.storage.from(bucket).list(userId)

      if (existingFiles) {
        const fileToDelete = existingFiles.find((file) => file.name === fileName)
        if (fileToDelete) {
          await supabase.storage.from(bucket).remove([filePath])
        }
      }
    } catch (error) {
      console.log("No existing file found, continuing...")
    }

    // Convert text to blob
    const textBlob = new Blob([text], { type: "text/plain" })
    const buffer = await textBlob.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)

    // Upload file to bucket
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, fileBuffer, {
      contentType: "text/plain",
      upsert: true,
    })

    if (error) {
      console.error(`Error saving text file to ${bucket}:`, error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      message: `Text file saved successfully to ${bucket}`,
    })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
