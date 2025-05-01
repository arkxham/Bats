// Use a LRU cache with limited size to prevent memory leaks
class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, V>

  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined

    // Get the value and refresh its position in the cache
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value!)
    return value
  }

  put(key: K, value: V): void {
    // Remove the key if it exists to refresh its position
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    // Evict the least recently used item if we're at capacity
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, value)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  forEach(callbackfn: (value: V, key: K) => void): void {
    this.cache.forEach(callbackfn)
  }
}

// Cache for API responses - limit to 20 entries to prevent memory bloat
const apiCache = new LRUCache<string, { data: any; timestamp: number }>(20)
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

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

// Helper function to make API requests with caching
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  // Generate cache key based on URL and request method
  const cacheKey = `${options.method || "GET"}-${url}-${JSON.stringify(options.body || {})}`

  // Check cache first
  const cachedResponse = apiCache.get(cacheKey)
  const now = Date.now()

  if (cachedResponse && now - cachedResponse.timestamp < CACHE_EXPIRY) {
    return cachedResponse.data
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Cache the response
    apiCache.put(cacheKey, { data, timestamp: now })

    return data
  } catch (error) {
    throw error
  }
}

// Direct test function for API connectivity
export async function testApiConnectivity() {
  const baseUrl = getApiBaseUrl()

  try {
    const response = await fetch(`${baseUrl}/api/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

// Clear cache for specific endpoint or all endpoints
export function clearApiCache(endpoint?: string) {
  if (endpoint) {
    const baseUrl = getApiBaseUrl()
    const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    // Clear all entries matching this endpoint
    apiCache.forEach((value, key) => {
      if (key.includes(url)) {
        apiCache.delete(key)
      }
    })
  } else {
    // Clear entire cache
    apiCache.clear()
  }
}
