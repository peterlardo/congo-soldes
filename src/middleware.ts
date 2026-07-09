import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const role = token?.role as string | undefined

    if (path.startsWith("/admin") && role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/connexion", req.url))
    }

    if (path.startsWith("/commercant") && role !== "MERCHANT" && role !== "SHOP_MANAGER" && role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/connexion", req.url))
    }

    if (path.startsWith("/client") && !role) {
      return NextResponse.redirect(new URL("/auth/connexion", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/commercant/:path*", "/client/:path*"],
}