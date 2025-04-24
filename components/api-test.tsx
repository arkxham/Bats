"use client"

import { useState } from "react"
import { getApiBaseUrl } from "@/lib/api-client"

export default function ApiTest() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const baseUrl = getApiBaseUrl()
      console.log(`Testing API at: ${baseUrl}/api/test`)

      const response = await fetch(`${baseUrl}/api/test`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log(`API response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        throw new Error(`API test failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API response data:", data)
      setResult(data)
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">API Test</h2>

      <button
        onClick={testApi}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        disabled={loading}
      >
        {loading ? "Testing..." : "Test API Connection"}
      </button>

      {error && (
        <div className="mt-2 p-2 bg-red-900/30 border border-red-500 rounded text-sm">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-2 p-2 bg-green-900/30 border border-green-500 rounded text-sm">
          <pre className="text-green-200 text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
