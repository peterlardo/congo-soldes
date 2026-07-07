import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role) {
      return NextResponse.redirect(new URL("/auth/connexion", process.env.NEXTAUTH_URL || "http://localhost:3000"))
    }

    const dashboardMap: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      COMMERCANT: "/commercant/dashboard",
      CLIENT: "/client/dashboard",
    }

    const target = dashboardMap[session.user.role] || "/"
    return NextResponse.redirect(new URL(target, process.env.NEXTAUTH_URL || "http://localhost:3000"))
  } catch {
    return NextResponse.redirect(new URL("/auth/connexion", process.env.NEXTAUTH_URL || "http://localhost:3000"))
  }
}
