import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      where: { actif: true },
      include: { _count: { select: { promotions: true } } },
      orderBy: { ordre: "asc" },
    })
    return NextResponse.json(categories)
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
    const categorie = await prisma.categorie.create({
      data: {
        nom: body.nom,
        slug: slugify(body.nom),
        description: body.description,
        icone: body.icone,
        ordre: body.ordre || 0,
      },
    })

    return NextResponse.json(categorie, { status: 201 })
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

    const body = await request.json()
    const categorie = await prisma.categorie.update({
      where: { id: body.id },
      data: {
        nom: body.nom,
        description: body.description,
        icone: body.icone,
        ordre: body.ordre,
        actif: body.actif,
      },
    })

    return NextResponse.json(categorie)
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await request.json()
    await prisma.categorie.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
