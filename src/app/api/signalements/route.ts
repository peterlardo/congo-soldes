import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const signalements = await prisma.signalement.findMany({
      include: {
        user: { select: { id: true, nom: true, email: true } },
        promotion: { include: { boutique: { select: { nom: true } } } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(signalements)
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { promotionId, motif, description } = await request.json()

    const signalement = await prisma.signalement.create({
      data: {
        userId: session.user.id,
        promotionId,
        motif,
        description,
      },
    })

    return NextResponse.json(signalement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { signalementId, statut } = await request.json()

    const signalement = await prisma.signalement.update({
      where: { id: signalementId },
      data: {
        statut,
        traitePar: session.user.id,
        traiteLe: new Date(),
      },
    })

    return NextResponse.json(signalement)
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
