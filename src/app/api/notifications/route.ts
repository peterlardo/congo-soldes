import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const nonLu = notifications.filter((n) => !n.lu).length

    return NextResponse.json({ notifications, nonLu })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, toutLire } = body

    if (toutLire) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, lu: false },
        data: { lu: true },
      })
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { lu: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
