import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ville = searchParams.get("ville")
    const search = searchParams.get("search")

    const where: any = { actif: true }
    if (ville) where.ville = { nom: ville }
    if (search) {
      where.OR = [
        { nom: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const boutiques = await prisma.boutique.findMany({
      where,
      include: {
        ville: true,
        _count: { select: { promotions: true, suiveurs: true, avis: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(boutiques)
  } catch (error) {
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "COMMERCANT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const boutique = await prisma.boutique.update({
      where: { proprietaireId: session.user.id },
      data: {
        nom: body.nom,
        description: body.description,
        adresse: body.adresse,
        quartier: body.quartier,
        telephone: body.telephone,
        whatsapp: body.whatsapp,
        email: body.email,
        siteWeb: body.siteWeb,
        horaires: body.horaires,
        facebook: body.facebook,
        instagram: body.instagram,
        latitude: body.latitude ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude ? parseFloat(body.longitude) : undefined,
      },
    })

    await prisma.journalActivite.create({
      data: {
        userId: session.user.id,
        action: "MISE_A_JOUR_BOUTIQUE",
        details: `Mise à jour de la boutique: ${boutique.nom}`,
      },
    })

    return NextResponse.json(boutique)
  } catch (error) {
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 })
  }
}
