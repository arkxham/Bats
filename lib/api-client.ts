// Get the base API URL based on the environment
export function getApiBaseUrl() {
  // Check if we're on the custom domain (bats.rip)
  const isCustomDomain =
    typeof window !== "undefined" &&
    (window.location.hostname === "bats.rip" || window.location.hostname.includes("bats.rip"))

  // If on custom domain, ALWAYS use the Vercel deployment URL for API calls
  if (isCustomDomain) {
    return "https://v0-custom-website-design-lyart.vercel.app"
  }

  // Use the NEXT_PUBLIC_SERVERLESS_API_URL environment variable if available
  // and it's not pointing to Supabase
  if (
    process.env.NEXT_PUBLIC_SERVERLESS_API_URL &&
    !process.env.NEXT_PUBLIC_SERVERLESS_API_URL.includes("supabase.co")
  ) {
    return process.env.NEXT_PUBLIC_SERVERLESS_API_URL
  }

  // In development, use relative URLs
  if (process.env.NODE_ENV === "development") {
    return ""
  }

  // Otherwise, use the current origin or the Vercel URL if available
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "https://v0-custom-website-design-lyart.vercel.app"

  return baseUrl
}

// Helper function to make API requests with browser compatibility in mind
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  try {
    // Add extra headers to help with browser compatibility
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest", // Helps identify AJAX requests
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
      // Add cache: 'no-store' to prevent caching issues
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request error for ${url}:`, error)
    throw error
  }
}

// Direct test function for API connectivity
export async function testApiConnectivity() {
  const baseUrl = getApiBaseUrl()

  try {
    // Try the fallback API first as it's more reliable
    const response = await fetch(`${baseUrl}/api/fallback`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details available")
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      }
    }

    const data = await response.json()
    return {
      success: true,
      status: response.status,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
