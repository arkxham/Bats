import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST() {
  try {
    const supabase = getSupabaseServer()

    // Check if the descriptions bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json({ success: false, error: bucketsError.message }, { status: 500 })
    }

    const descriptionsExists = buckets?.some((bucket) => bucket.name === "descriptions")

    if (!descriptionsExists) {
      // Create the descriptions bucket
      const { error: createError } = await supabase.storage.createBucket("descriptions", {
        public: true,
      })

      if (createError) {
        console.error("Error creating descriptions bucket:", createError)
        return NextResponse.json({ success: false, error: createError.message }, { status: 500 })
      }
    }

    // Set up RLS policies for the descriptions bucket
    const setupPolicies = async () => {
      // Delete existing policies to avoid conflicts
      try {
        const { error: deleteError } = await supabase.rpc("delete_policies_for_bucket", { bucket_name: "descriptions" })
        if (deleteError) console.error("Error deleting policies:", deleteError)
      } catch (e) {
        console.error("Error in delete_policies_for_bucket RPC:", e)
        // Continue anyway, as the function might not exist
      }

      // Create policies for descriptions bucket
      // Allow anonymous users to select (read) files
      await supabase
        .rpc("create_storage_policy", {
          bucket_name: "descriptions",
          policy_name: "Descriptions Public Read",
          definition: {
            name: "Descriptions Public Read",
            statement: "SELECT",
            resource: "descriptions/*",
            action: "select",
            role: "anon",
          },
        })
        .catch((e) => console.error("Error creating read policy:", e))

      // Allow authenticated users to insert files
      await supabase
        .rpc("create_storage_policy", {
          bucket_name: "descriptions",
          policy_name: "Descriptions Insert Policy",
          definition: {
            name: "Descriptions Insert Policy",
            statement: "INSERT",
            resource: "descriptions/*",
            action: "insert",
            role: "authenticated",
          },
        })
        .catch((e) => console.error("Error creating insert policy:", e))

      // Allow authenticated users to update files
      await supabase
        .rpc("create_storage_policy", {
          bucket_name: "descriptions",
          policy_name: "Descriptions Update Policy",
          definition: {
            name: "Descriptions Update Policy",
            statement: "UPDATE",
            resource: "descriptions/*",
            action: "update",
            role: "authenticated",
          },
        })
        .catch((e) => console.error("Error creating update policy:", e))

      // Allow authenticated users to delete files
      await supabase
        .rpc("create_storage_policy", {
          bucket_name: "descriptions",
          policy_name: "Descriptions Delete Policy",
          definition: {
            name: "Descriptions Delete Policy",
            statement: "DELETE",
            resource: "descriptions/*",
            action: "delete",
            role: "authenticated",
          },
        })
        .catch((e) => console.error("Error creating delete policy:", e))
    }

    // Try to set up policies
    await setupPolicies()

    return NextResponse.json({ success: true, message: "Descriptions bucket setup complete" })
  } catch (error: any) {
    console.error("Error setting up descriptions bucket:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
