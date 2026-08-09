import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow setup wizard without auth
  if (pathname.startsWith("/setup")) {
    return NextResponse.next()
  }

  // Allow login page without auth
  if (pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  // Allow assets without auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/bridge") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/print") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/invoice") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|webp|json)$/)
  ) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
