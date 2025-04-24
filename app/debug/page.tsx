"use client"

import { useState, useEffect } from "react"
import { getApiBaseUrl, testApiConnectivity } from "@/lib/api-client"

export default function DebugPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState("")
  const [hostname, setHostname] = useState("")
  const [testResult, setTestResult] = useState<any>(null)
  const [userFilesResult, setUserFilesResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userFilesLoading, setUserFilesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userFilesError, setUserFilesError] = useState<string | null>(null)
  const [userId, setUserId] = useState("test-user")
  const [requestMethod, setRequestMethod] = useState<"GET" | "POST">("POST")

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
      const result = await testApiConnectivity()
      setTestResult(result)

      if (!result.success) {
        setError(`API test failed: ${result.error || "Unknown error"}`)
      }
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const testUserFilesApi = async () => {
    setUserFilesLoading(true)
    setUserFilesError(null)
    setUserFilesResult(null)

    try {
      const baseUrl = getApiBaseUrl()
      console.log(`Testing user-files API at: ${baseUrl}/api/user-files with method ${requestMethod}`)

      let response

      if (requestMethod === "POST") {
        response = await fetch(`${baseUrl}/api/user-files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        })
      } else {
        response = await fetch(`${baseUrl}/api/user-files?userId=${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      }

      console.log(`User-files API response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No error details available")
        console.error("User-files API request failed:", errorText)
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log("User-files API response data:", data)
      setUserFilesResult(data)
    } catch (err: any) {
      console.error("User-files API test error:", err)
      setUserFilesError(err.message || "Unknown error")
    } finally {
      setUserFilesLoading(false)
    }
  }

  const directFetchTest = () => {
    const code = `
    // Copy and paste this code into your browser console
    (async () => {
      try {
        const response = await fetch("/api/test", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        console.log("Response status:", response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(\`API request failed: \${response.status} \${response.statusText}\`);
        }
        
        const data = await response.json();
        console.log("Response data:", data);
        return data;
      } catch (error) {
        console.error("Fetch error:", error);
      }
    })();
    `

    console.log("Direct fetch test code:")
    console.log(code)

    // Also try to execute it
    ;(async () => {
      try {
        const response = await fetch("/api/test", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("Direct test - Response status:", response.status, response.statusText)

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Direct test - Response data:", data)
      } catch (error) {
        console.error("Direct test - Fetch error:", error)
      }
    })()
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
            <span className="text-gray-400">Has NEXT_PUBLIC_SUPABASE_URL:</span>
            <span className="ml-2 text-yellow-500">{process.env.NEXT_PUBLIC_SUPABASE_URL ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="text-gray-400">Has NEXT_PUBLIC_SERVERLESS_API_URL:</span>
            <span className="ml-2 text-yellow-500">{process.env.NEXT_PUBLIC_SERVERLESS_API_URL ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test API Endpoint</h2>
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          {loading ? "Testing..." : "Test API Connection"}
        </button>

        <button
          onClick={directFetchTest}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-4"
        >
          Run Direct Fetch Test (check console)
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
            <pre className="whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test User-Files API</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Request Method</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="GET"
                checked={requestMethod === "GET"}
                onChange={() => setRequestMethod("GET")}
                className="mr-2"
              />
              GET
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="POST"
                checked={requestMethod === "POST"}
                onChange={() => setRequestMethod("POST")}
                className="mr-2"
              />
              POST
            </label>
          </div>
        </div>

        <button
          onClick={testUserFilesApi}
          disabled={userFilesLoading}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          {userFilesLoading ? "Testing..." : "Test User-Files API"}
        </button>

        {userFilesError && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap">{userFilesError}</pre>
          </div>
        )}

        {userFilesResult && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 p-4 rounded">
            <h3 className="font-semibold mb-2">Success:</h3>
            <pre className="whitespace-pre-wrap">{JSON.stringify(userFilesResult, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>
            Check that your API routes are accessible by visiting{" "}
            <code className="bg-gray-800 px-1 rounded">/api/test</code> directly
          </li>
          <li>Verify that the browser Network tab shows requests being made to the API</li>
          <li>Ensure your environment variables are set correctly</li>
          <li>Check for CORS issues by looking at the browser console</li>
          <li>Try using both GET and POST methods to see if one works</li>
          <li>Verify that your middleware isn't blocking API routes</li>
          <li>Check server logs for any backend errors</li>
        </ol>
      </div>
    </div>
  )
}
