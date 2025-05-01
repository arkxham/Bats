import { NextResponse } from "next/server"

// Simple fallback API that always returns a successful response
// This is used when the main API route fails due to browser compatibility issues

export async function GET() {
  console.log("[fallback] GET request received")

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  }

  try {
    // Return a simple success response with empty data
    return NextResponse.json(
      {
        success: true,
        message: "This is a fallback response. Using default profile data.",
        timestamp: new Date().toISOString(),
        files: {
          "profile-picture": [],
          backgrounds: [],
          songs: [],
          descriptions: [],
        },
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error("[fallback] Error:", error)
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}

// Also handle OPTIONS for CORS preflight
export async function OPTIONS() {
  console.log("[fallback] OPTIONS request received")
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
  })
}

// Also handle POST for consistency
export async function POST() {
  console.log("[fallback] POST request received")

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  }

  try {
    // Return the same response as GET
    return NextResponse.json(
      {
        success: true,
        message: "This is a fallback response from POST. Using default profile data.",
        timestamp: new Date().toISOString(),
        files: {
          "profile-picture": [],
          backgrounds: [],
          songs: [],
          descriptions: [],
        },
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error("[fallback] Error in POST:", error)
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
