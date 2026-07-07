import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const favoris = await prisma.favori.findMany({
      where: { userId: session.user.id },
      include: {
        promotion: {
          include: {
            boutique: { include: { ville: true } },
            photos: { take: 1 },
            categorie: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(favoris)
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { promotionId } = await request.json()
    if (!promotionId) {
      return NextResponse.json({ error: "ID promotion requis" }, { status: 400 })
    }

    const existing = await prisma.favori.findUnique({
      where: { userId_promotionId: { userId: session.user.id, promotionId } },
    })

    if (existing) {
      await prisma.favori.delete({ where: { id: existing.id } })
      await prisma.promotion.update({
        where: { id: promotionId },
        data: { nombreFavoris: { decrement: 1 } },
      })
      return NextResponse.json({ favori: false })
    }

    const favori = await prisma.favori.create({
      data: { userId: session.user.id, promotionId },
    })

    await prisma.promotion.update({
      where: { id: promotionId },
      data: { nombreFavoris: { increment: 1 } },
    })

    return NextResponse.json({ favori: true, data: favori })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
