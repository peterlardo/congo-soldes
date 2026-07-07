import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { expediteurId: session.user.id },
          { destinataireId: session.user.id },
        ],
      },
      include: {
        expediteur: { select: { id: true, nom: true, prenom: true, avatar: true } },
        destinataire: { select: { id: true, nom: true, prenom: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    const nonLu = await prisma.message.count({
      where: { destinataireId: session.user.id, lu: false },
    })

    return NextResponse.json({ messages, nonLu })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { destinataireId, sujet, contenu } = await request.json()

    if (!destinataireId || !contenu) {
      return NextResponse.json({ error: "Destinataire et contenu requis" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        expediteurId: session.user.id,
        destinataireId,
        sujet: sujet || null,
        contenu,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
