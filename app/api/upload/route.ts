import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string
    const userId = formData.get("userId") as string
    const fileName = (formData.get("fileName") as string) || file.name

    console.log("Upload request received:", { bucket, userId, fileName })

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!bucket) {
      return NextResponse.json({ error: "No bucket specified" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "No user ID specified" }, { status: 400 })
    }

    // Get admin Supabase client with service role key
    const supabase = getSupabaseServer()

    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json({ error: "Failed to list buckets", details: bucketsError.message }, { status: 500 })
    }

    const bucketExists = buckets.some((b) => b.name === bucket)

    if (!bucketExists) {
      console.log(`Bucket ${bucket} does not exist, creating it...`)
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
      })

      if (createError) {
        console.error(`Failed to create bucket ${bucket}:`, createError)
        return NextResponse.json({ error: "Failed to create bucket", details: createError.message }, { status: 500 })
      }
    }

    // Ensure the bucket is public
    const { error: updateError } = await supabase.storage.updateBucket(bucket, {
      public: true,
    })

    if (updateError) {
      console.error(`Failed to update bucket ${bucket}:`, updateError)
    }

    // Delete existing files in the user's folder before uploading new one
    try {
      console.log(`Checking for existing files in ${bucket}/${userId}`)
      const { data: existingFiles, error: listError } = await supabase.storage.from(bucket).list(userId)

      if (listError) {
        console.error(`Error listing files in ${bucket}/${userId}:`, listError)
      } else if (existingFiles && existingFiles.length > 0) {
        console.log(`Found ${existingFiles.length} existing files to delete`)

        // For backgrounds and songs, delete all files
        // For profile pictures, only delete files that start with the same prefix (e.g., "pic.")
        const filesToDelete = existingFiles
          .filter((file) => {
            if (bucket === "backgrounds" || bucket === "songs") {
              return true // Delete all background and song files
            } else if (bucket === "profile-picture" && fileName.startsWith("pic.")) {
              return file.name.startsWith("pic.") // Only delete profile pictures
            }
            return false
          })
          .map((file) => `${userId}/${file.name}`)

        if (filesToDelete.length > 0) {
          console.log(`Deleting ${filesToDelete.length} files:`, filesToDelete)
          const { error: deleteError } = await supabase.storage.from(bucket).remove(filesToDelete)

          if (deleteError) {
            console.error(`Error deleting files from ${bucket}:`, deleteError)
          } else {
            console.log(`Successfully deleted ${filesToDelete.length} files from ${bucket}`)
          }
        }
      }
    } catch (error) {
      console.error(`Error handling existing files in ${bucket}:`, error)
      // Continue with upload even if deletion fails
    }

    // Create path for the file
    const filePath = `${userId}/${fileName}`
    console.log(`Uploading to path: ${filePath} in bucket: ${bucket}`)

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      upsert: true,
      cacheControl: "0",
    })

    if (error) {
      console.error("Upload error:", error)
      return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    console.log("Upload successful, public URL:", publicUrl)

    // Add timestamp for cache busting
    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`

    return NextResponse.json({
      success: true,
      url: cacheBustedUrl,
      path: data?.path || filePath,
    })
  } catch (error) {
    console.error("Upload handler error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
