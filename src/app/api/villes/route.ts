import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const villes = await prisma.ville.findMany({
      where: { actif: true },
      include: {
        _count: { select: { boutiques: true } },
        quartiers: { where: { actif: true } },
      },
      orderBy: { nom: "asc" },
    })
    return NextResponse.json(villes)
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const ville = await prisma.ville.create({
      data: {
        nom: body.nom,
        slug: slugify(body.nom),
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
      },
    })

    return NextResponse.json(ville, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
