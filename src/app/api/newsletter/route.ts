import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 })
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } })

    if (existing) {
      if (!existing.actif) {
        await prisma.newsletter.update({
          where: { email },
          data: { actif: true },
        })
        return NextResponse.json({ message: "Inscription réactivée" })
      }
      return NextResponse.json({ message: "Déjà inscrit" })
    }

    await prisma.newsletter.create({ data: { email } })
    return NextResponse.json({ message: "Inscription réussie" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json()
    await prisma.newsletter.update({
      where: { email },
      data: { actif: false },
    })
    return NextResponse.json({ message: "Désinscription réussie" })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
