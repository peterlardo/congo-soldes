import { NextResponse } from "next/server"
import { notifySubscriptionExpiring } from "@/lib/notifications"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await notifySubscriptionExpiring()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur cron notifications:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}