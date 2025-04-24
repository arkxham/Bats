"use client"

import { useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function SetupStorage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = getSupabaseBrowser()

  const setupStorage = async () => {
    try {
      setLoading(true)
      setMessage("Setting up storage buckets and policies...")

      // Create the buckets if they don't exist
      const { error: bucketsError } = await supabase.rpc("create_storage_buckets")
      if (bucketsError) {
        console.error("Error creating buckets:", bucketsError)
        setMessage(`Error creating buckets: ${bucketsError.message}`)
        return
      }

      // Set up storage policies
      const { error: policiesError } = await supabase.rpc("create_storage_policies")
      if (policiesError) {
        console.error("Error creating policies:", policiesError)
        setMessage(`Error creating policies: ${policiesError.message}`)
        return
      }

      // Manually update bucket settings to be public
      const { data: buckets } = await supabase.storage.listBuckets()

      for (const bucket of buckets || []) {
        if (
          bucket.name === "profile-picture" ||
          bucket.name === "backgrounds" ||
          bucket.name === "songs" ||
          bucket.name === "descriptions"
        ) {
          const { error } = await supabase.storage.updateBucket(bucket.name, {
            public: true,
          })

          if (error) {
            console.error(`Error updating bucket ${bucket.name}:`, error)
          }
        }
      }

      // Create descriptions bucket if it doesn't exist
      try {
        const { error: descriptionsBucketError } = await supabase.storage.createBucket("descriptions", {
          public: true,
        })
        if (descriptionsBucketError && !descriptionsBucketError.message.includes("already exists")) {
          console.error("Error creating descriptions bucket:", descriptionsBucketError)
          setMessage(`Error creating descriptions bucket: ${descriptionsBucketError.message}`)
        } else {
          setMessage((prev) => prev + "\nDescriptions bucket created or already exists")
        }
      } catch (error: any) {
        console.error("Error creating descriptions bucket:", error)
        setMessage(`Error creating descriptions bucket: ${error.message}`)
      }

      // Set up RLS policies for descriptions bucket
      try {
        // First, delete any existing policies to avoid conflicts
        const { error: deleteError } = await supabase.rpc("create_storage_policies")

        if (deleteError) {
          console.error("Error setting up storage policies:", deleteError)
          setMessage(`Error setting up storage policies: ${deleteError.message}`)
        } else {
          setMessage((prev) => prev + "\nStorage policies set up successfully")
        }
      } catch (error: any) {
        console.error("Error setting up storage policies:", error)
        setMessage(`Error setting up storage policies: ${error.message}`)
      }

      setMessage("Storage setup complete! Buckets and policies have been configured.")
    } catch (error: any) {
      console.error("Error setting up storage:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border border-gray-700 rounded-md">
      <h3 className="text-md font-semibold mb-3">Storage Setup</h3>
      <p className="text-sm text-gray-400 mb-3">
        If you're having issues with uploads, run this setup to configure storage buckets and policies.
      </p>
      <Button onClick={setupStorage} disabled={loading} className="bg-purple-700 hover:bg-purple-600 text-white">
        <Database className={`h-4 w-4 mr-2 ${loading ? "animate-pulse" : ""}`} />
        {loading ? "Setting up..." : "Setup Storage Buckets"}
      </Button>

      {message && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-sm">
          <pre className="whitespace-pre-wrap">{message}</pre>
        </div>
      )}
    </div>
  )
}
