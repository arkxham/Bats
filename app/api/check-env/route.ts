import { NextResponse } from "next/server"

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

export async function GET() {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  // Check if essential environment variables are set
  const envStatus = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || null,
    serverlessApiUrl: process.env.NEXT_PUBLIC_SERVERLESS_API_URL || null,
  }

  // Don't expose actual values, just whether they're set or not
  return NextResponse.json(
    {
      status: "ok",
      environment: process.env.NODE_ENV,
      variables: envStatus,
      timestamp: new Date().toISOString(),
    },
    {
      headers: corsHeaders,
    },
  )
}
