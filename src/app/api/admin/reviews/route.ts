import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        shop: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Erreur admin reviews:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { reviewId, status } = body

    if (!reviewId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 })
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Erreur maj review:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}