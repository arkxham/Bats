import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.log("[test] GET request received", {
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  })

  return NextResponse.json(
    {
      success: true,
      message: "API is working",
      method: "GET",
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServerlessApiUrl: !!process.env.NEXT_PUBLIC_SERVERLESS_API_URL,
        hasVercelUrl: !!process.env.NEXT_PUBLIC_VERCEL_URL,
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export async function POST(request: Request) {
  console.log("[test] POST request received", {
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  })

  let body
  try {
    body = await request.json()
    console.log("[test] POST body:", body)
  } catch (error) {
    console.error("[test] Error parsing request body:", error)
    body = {}
  }

  return NextResponse.json(
    {
      success: true,
      message: "API is working",
      method: "POST",
      receivedBody: body,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export async function OPTIONS() {
  console.log("[test] OPTIONS request received")

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
