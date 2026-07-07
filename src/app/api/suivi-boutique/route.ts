import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const suivis = await prisma.suiviBoutique.findMany({
      where: { userId: session.user.id },
      include: {
        boutique: {
          include: { ville: true, _count: { select: { promotions: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(suivis)
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { boutiqueId } = await request.json()
    if (!boutiqueId) {
      return NextResponse.json({ error: "ID boutique requis" }, { status: 400 })
    }

    const existing = await prisma.suiviBoutique.findUnique({
      where: { userId_boutiqueId: { userId: session.user.id, boutiqueId } },
    })

    if (existing) {
      await prisma.suiviBoutique.delete({ where: { id: existing.id } })
      return NextResponse.json({ suivre: false })
    }

    await prisma.suiviBoutique.create({
      data: { userId: session.user.id, boutiqueId },
    })

    return NextResponse.json({ suivre: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
