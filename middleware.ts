import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Log middleware execution for debugging
  console.log(`[Middleware] Processing request for: ${url.pathname}`)

  // Always allow API routes to pass through
  if (url.pathname.startsWith("/api/")) {
    console.log(`[Middleware] Allowing API route: ${url.pathname}`)
    return NextResponse.next()
  }

  // If trying to access login or loading page, redirect to desktop
  if (url.pathname === "/" || url.pathname === "/loading") {
    url.pathname = "/desktop"
    console.log(`[Middleware] Redirecting to: ${url.pathname}`)
    return NextResponse.redirect(url)
  }

  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
