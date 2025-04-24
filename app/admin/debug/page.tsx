"use client"

import { useState, useEffect } from "react"
import { getApiBaseUrl } from "@/lib/api-client"
import { checkSupabaseConnection } from "@/lib/supabase"

export default function DebugPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState("")
  const [hostname, setHostname] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [supabaseResult, setSupabaseResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  useEffect(() => {
    // Get the API base URL
    const baseUrl = getApiBaseUrl()
    setApiBaseUrl(baseUrl)

    // Get the hostname
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname)
    }
  }, [])

  const testApi = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const baseUrl = getApiBaseUrl()
      console.log(`Testing API at: ${baseUrl}/api/check-env`)

      const response = await fetch(`${baseUrl}/api/check-env`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API test failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const testSupabase = async () => {
    setSupabaseLoading(true)
    setSupabaseError(null)
    setSupabaseResult(null)

    try {
      const baseUrl = getApiBaseUrl()
      console.log(`Testing Supabase connection via API at: ${baseUrl}/api/test-supabase`)

      const response = await fetch(`${baseUrl}/api/test-supabase`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Supabase test failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setSupabaseResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      console.error("Supabase test error:", err)
      setSupabaseError(err.message || "Unknown error")

      // Try direct client-side test as fallback
      try {
        console.log("Attempting direct client-side Supabase connection test")
        const result = await checkSupabaseConnection()
        setSupabaseResult(JSON.stringify(result, null, 2) + "\n\n(Direct client-side test)")
      } catch (directErr: any) {
        console.error("Direct Supabase test error:", directErr)
        setSupabaseError((prev) => `${prev}\n\nDirect test also failed: ${directErr.message}`)
      }
    } finally {
      setSupabaseLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">API Debug Page</h1>

      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
        <div className="space-y-2">
          <div>
            <span className="text-gray-400">Current Hostname:</span>
            <span className="ml-2 text-yellow-500">{hostname}</span>
          </div>
          <div>
            <span className="text-gray-400">API Base URL:</span>
            <span className="ml-2 text-yellow-500">{apiBaseUrl}</span>
          </div>
          <div>
            <span className="text-gray-400">NODE_ENV:</span>
            <span className="ml-2 text-yellow-500">{process.env.NODE_ENV}</span>
          </div>
          <div>
            <span className="text-gray-400">Supabase URL:</span>
            <span className="ml-2 text-yellow-500">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgggsudeipsyfcszouil.supabase.co"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Test</h2>
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          {loading ? "Testing..." : "Test API Connection"}
        </button>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {testResult && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 p-4 rounded">
            <h3 className="font-semibold mb-2">Success:</h3>
            <pre className="whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Supabase Test</h2>
        <button
          onClick={testSupabase}
          disabled={supabaseLoading}
          className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded mb-4"
        >
          {supabaseLoading ? "Testing..." : "Test Supabase Connection"}
        </button>

        {supabaseError && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap">{supabaseError}</pre>
          </div>
        )}

        {supabaseResult && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 p-4 rounded">
            <h3 className="font-semibold mb-2">Success:</h3>
            <pre className="whitespace-pre-wrap">{supabaseResult}</pre>
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Ensure your Vercel deployment is working correctly</li>
          <li>Check that your custom domain is properly configured in Vercel</li>
          <li>Verify that the API routes are working on the Vercel deployment URL</li>
          <li>
            Make sure the <code className="bg-gray-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="bg-gray-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> environment variables are
            set correctly
          </li>
          <li>Verify that your Supabase storage buckets exist and have the correct permissions</li>
          <li>Clear your browser cache and try again</li>
        </ol>
      </div>
    </div>
  )
}
