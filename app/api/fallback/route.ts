import { NextResponse } from "next/server"

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export async function GET() {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  return NextResponse.json(
    {
      success: true,
      message: "Fallback API is working",
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
}

export async function POST() {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  return NextResponse.json(
    {
      success: true,
      message: "This is a fallback response. The main API might be experiencing issues.",
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
}
