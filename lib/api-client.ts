// Get the base API URL based on the environment
export function getApiBaseUrl() {
  // Use the NEXT_PUBLIC_SERVERLESS_API_URL environment variable if available
  if (process.env.NEXT_PUBLIC_SERVERLESS_API_URL) {
    return process.env.NEXT_PUBLIC_SERVERLESS_API_URL
  }

  // In development, use relative URLs
  if (process.env.NODE_ENV === "development") {
    return ""
  }

  // Check if we're on the custom domain
  const isCustomDomain =
    typeof window !== "undefined" &&
    (window.location.hostname === "bats.rip" || window.location.hostname.includes("bats.rip"))

  // If on custom domain, use the Vercel deployment URL
  if (isCustomDomain) {
    return "https://v0-custom-website-design-lyart.vercel.app"
  }

  // Otherwise, use the current origin or the Vercel URL if available
  return typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "https://v0-custom-website-design-lyart.vercel.app"
}

// Helper function to make API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  console.log(`Making API request to: ${url}`)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details available")
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`API request error for ${url}:`, error)
    throw error
  }
}
