import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const slugify = (text: string) => text
  .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[&]/g, "et").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { status: true },
      include: {
        _count: { select: { promotions: true } },
        subCategories: true,
      },
      orderBy: { displayOrder: "asc" },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Erreur catégories:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: slugify(body.name),
        description: body.description || null,
        icon: body.icon || null,
        image: body.image || null,
        displayOrder: body.displayOrder || 0,
        status: true,
        parentId: body.parentId || null,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Erreur création catégorie:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const category = await prisma.category.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description || null,
        icon: body.icon || null,
        image: body.image || null,
        displayOrder: body.displayOrder,
        status: body.status,
        parentId: body.parentId || null,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Erreur mise à jour catégorie:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await request.json()
    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur suppression catégorie:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}