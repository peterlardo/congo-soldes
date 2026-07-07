import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role) {
      return NextResponse.redirect(new URL("/auth/connexion", request.url).toString())
    }

    const dashboardMap: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      COMMERCANT: "/commercant/dashboard",
      CLIENT: "/client/dashboard",
    }

    const target = dashboardMap[session.user.role] || "/"
    return NextResponse.redirect(new URL(target, request.url).toString())
  } catch {
    return NextResponse.redirect(new URL("/auth/connexion", request.url).toString())
  }
}
