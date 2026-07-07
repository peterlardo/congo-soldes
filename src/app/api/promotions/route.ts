import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorie = searchParams.get("categorie")
    const ville = searchParams.get("ville")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = { statut: "ACTIF" }
    if (categorie) where.categorie = { slug: categorie }
    if (search) {
      where.OR = [
        { nom: { contains: search } },
        { descriptionCourte: { contains: search } },
        { descriptionDetaillee: { contains: search } },
      ]
    }
    if (ville) {
      where.boutique = { ville: { nom: ville } }
    }

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        include: {
          boutique: { select: { nom: true, slug: true, logo: true, ville: true } },
          categorie: { select: { nom: true, slug: true, icone: true } },
          photos: { orderBy: { ordre: "asc" }, take: 1 },
          _count: { select: { favoris: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.promotion.count({ where }),
    ])

    return NextResponse.json({
      promotions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "COMMERCANT" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const boutique = await prisma.boutique.findUnique({
      where: { proprietaireId: session.user.id },
      include: { abonnements: { where: { actif: true }, take: 1 } },
    })

    if (!boutique) {
      return NextResponse.json({ error: "Aucune boutique trouvée" }, { status: 400 })
    }

    const promoCount = await prisma.promotion.count({
      where: { boutiqueId: boutique.id, statut: { not: "EXPIRE" } },
    })

    const abonnement = boutique.abonnements[0]
    if (abonnement && abonnement.maxPromotions > 0 && promoCount >= abonnement.maxPromotions) {
      return NextResponse.json({
        error: "Limite de promotions atteinte pour votre abonnement",
      }, { status: 400 })
    }

    const slug = `${slugify(body.nom)}-${Date.now().toString(36)}`
    const reduction = body.prixNormal > 0
      ? Math.round(((body.prixNormal - body.prixPromotionnel) / body.prixNormal) * 100)
      : null

    const promotion = await prisma.promotion.create({
      data: {
        boutiqueId: boutique.id,
        categorieId: body.categorieId,
        sousCategorieId: body.sousCategorieId || null,
        nom: body.nom,
        slug,
        descriptionCourte: body.descriptionCourte || null,
        descriptionDetaillee: body.descriptionDetaillee || null,
        prixNormal: parseFloat(body.prixNormal),
        prixPromotionnel: parseFloat(body.prixPromotionnel),
        pourcentageReduction: reduction,
        stockDisponible: body.stockDisponible ? parseInt(body.stockDisponible) : null,
        dateDebut: new Date(body.dateDebut),
        dateFin: new Date(body.dateFin),
        sponsorise: body.sponsorise || false,
        statut: session.user.role === "ADMIN" ? "ACTIF" : "EN_ATTENTE",
      },
    })

    if (body.photos && body.photos.length > 0) {
      await prisma.photoPromotion.createMany({
        data: body.photos.map((url: string, index: number) => ({
          promotionId: promotion.id,
          url,
          ordre: index,
        })),
      })
    }

    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    console.error("Erreur création promotion:", error)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}
