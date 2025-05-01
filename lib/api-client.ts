// Get the base API URL based on the environment
export function getApiBaseUrl() {
  console.log("Environment variables:", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SERVERLESS_API_URL: process.env.NEXT_PUBLIC_SERVERLESS_API_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  })

  // Check if we're on the custom domain (bats.rip)
  const isCustomDomain =
    typeof window !== "undefined" &&
    (window.location.hostname === "bats.rip" || window.location.hostname.includes("bats.rip"))

  // If on custom domain, ALWAYS use the Vercel deployment URL for API calls
  if (isCustomDomain) {
    console.log("On bats.rip domain - using Vercel URL for API calls")
    return "https://v0-custom-website-design-lyart.vercel.app"
  }

  // Use the NEXT_PUBLIC_SERVERLESS_API_URL environment variable if available
  // and it's not pointing to Supabase
  if (
    process.env.NEXT_PUBLIC_SERVERLESS_API_URL &&
    !process.env.NEXT_PUBLIC_SERVERLESS_API_URL.includes("supabase.co")
  ) {
    console.log(`Using NEXT_PUBLIC_SERVERLESS_API_URL: ${process.env.NEXT_PUBLIC_SERVERLESS_API_URL}`)
    return process.env.NEXT_PUBLIC_SERVERLESS_API_URL
  }

  // In development, use relative URLs
  if (process.env.NODE_ENV === "development") {
    console.log("Using relative URL (empty string) for development")
    return ""
  }

  // Otherwise, use the current origin or the Vercel URL if available
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "https://v0-custom-website-design-lyart.vercel.app"

  console.log(`Using determined base URL: ${baseUrl}`)
  return baseUrl
}

// Helper function to make API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  console.log(`Making API request to: ${url}`, {
    method: options.method || "GET",
    headers: options.headers,
    body: options.body ? "(body present)" : "(no body)",
  })

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    console.log(`API response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details available")
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("API response data:", data)
    return data
  } catch (error) {
    console.error(`API request error for ${url}:`, error)
    throw error
  }
}

// Direct test function for API connectivity
export async function testApiConnectivity() {
  const baseUrl = getApiBaseUrl()
  console.log(`Testing API connectivity to: ${baseUrl}/api/test`)

  try {
    const response = await fetch(`${baseUrl}/api/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log(`Test API response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details available")
      console.error("Test API request failed:", errorText)
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      }
    }

    const data = await response.json()
    console.log("Test API response data:", data)

    return {
      success: true,
      status: response.status,
      data,
    }
  } catch (error) {
    console.error("Test API connectivity error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
