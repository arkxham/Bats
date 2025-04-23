"use client"

import { useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function SetupDatabase() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = getSupabaseBrowser()

  const setupDatabase = async () => {
    try {
      setLoading(true)
      setMessage("Setting up database...")

      // Create profiles table
      const { error: profilesError } = await supabase.rpc("create_profiles_table")
      if (profilesError) throw profilesError

      // Create storage buckets
      const { error: bucketsError } = await supabase.rpc("create_storage_buckets")
      if (bucketsError) throw bucketsError

      // Create storage policies
      const { error: policiesError } = await supabase.rpc("create_storage_policies")
      if (policiesError) throw policiesError

      setMessage("Database setup complete!")
    } catch (error: any) {
      console.error("Error setting up database:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Setup</h1>
      <Button onClick={setupDatabase} disabled={loading} className="mb-4">
        {loading ? "Setting up..." : "Setup Database"}
      </Button>
      {message && (
        <div className="p-4 bg-gray-800 rounded">
          <pre>{message}</pre>
        </div>
      )}
    </div>
  )
}
