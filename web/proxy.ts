import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = ["/setup", "/login", "/api/auth"]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
    || pathname.startsWith("/_next")
    || pathname.startsWith("/api/bridge")
    || pathname.match(/\.(ico|png|svg|jpg|jpeg|webp|json)$/)

  const token = request.cookies.get("authjs.session-token")?.value
    || request.cookies.get("__Secure-authjs.session-token")?.value

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
