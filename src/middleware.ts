import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/connexion", req.url))
    }

    if (path.startsWith("/commercant") && token?.role !== "COMMERCANT" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/connexion", req.url))
    }

    if (path.startsWith("/client") && !token) {
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
