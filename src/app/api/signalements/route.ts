import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const reports = await prisma.report.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        promotion: { include: { shop: { select: { name: true } } } },
        shop: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Erreur signalements:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { promotionId, shopId, reason, description } = await request.json()

    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        promotionId: promotionId || null,
        shopId: shopId || null,
        reason,
        description: description || null,
      },
    })

    // Auto-hide after 5 reports on same promotion
    if (promotionId) {
      const reportCount = await prisma.report.count({
        where: { promotionId, status: { not: "DISMISSED" } },
      })
      if (reportCount >= 5) {
        await prisma.promotion.update({
          where: { id: promotionId },
          data: { status: "ARCHIVED" },
        })
        await prisma.report.updateMany({
          where: { promotionId, status: "PENDING" },
          data: { status: "AUTO_HIDDEN" },
        })
      }
    }

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error("Erreur signalement:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { reportId, status, adminResponse } = await request.json()

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status || "RESOLVED",
        adminResponse: adminResponse || null,
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Erreur mise à jour signalement:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}