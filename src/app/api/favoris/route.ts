import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
promotion: {
           include: {
             shop: { select: { id: true, name: true, slug: true, logo: true, address: true, arrondissement: true } },
             media: { orderBy: { displayOrder: "asc" }, take: 1 },
           },
         },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Erreur favoris:", error)
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

    const existing = await prisma.favorite.findUnique({
      where: { userId_promotionId: { userId: session.user.id, promotionId } },
    })

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      await prisma.promotion.update({
        where: { id: promotionId },
        data: { favoritesCount: { decrement: 1 } },
      })
      return NextResponse.json({ favori: false })
    }

    const favori = await prisma.favorite.create({
      data: { userId: session.user.id, promotionId },
    })

    await prisma.promotion.update({
      where: { id: promotionId },
      data: { favoritesCount: { increment: 1 } },
    })

    return NextResponse.json({ favori: true, data: favori })
  } catch (error) {
    console.error("Erreur ajout favori:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}