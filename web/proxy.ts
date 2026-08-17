import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hasAnyUser } from "@/lib/queries/users"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/bridge") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|webp|json)$/)

  if (isAsset) return NextResponse.next()

  const token =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  if (token) return NextResponse.next()

  if (pathname.startsWith("/setup") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const hasUsers = await hasAnyUser()

  if (!hasUsers) {
    const url = new URL("/setup", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/login")) return NextResponse.next()

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("callbackUrl", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
