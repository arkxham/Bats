import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // If trying to access login or loading page, redirect to desktop
  if (url.pathname === "/" || url.pathname === "/loading") {
    url.pathname = "/desktop"
    return NextResponse.redirect(url)
  }

  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
