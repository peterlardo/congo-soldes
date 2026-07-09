import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""
    const category = searchParams.get("category")
    const arrondissement = searchParams.get("arrondissement")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minDiscount = searchParams.get("minDiscount")
    const sortBy = searchParams.get("sortBy") || "relevance"
    const type = searchParams.get("type") || "promotions"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    if (type === "shops") {
      const shopWhere: any = { status: { in: ["APPROVED", "ACTIVE"] } }

      if (q) {
        shopWhere.OR = [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { district: { contains: q, mode: "insensitive" } },
        ]
      }
      if (arrondissement) shopWhere.arrondissement = { slug: arrondissement }
      if (category) shopWhere.category = { slug: category }

      const [shops, total] = await Promise.all([
        prisma.shop.findMany({
          where: shopWhere,
          include: {
            category: { select: { id: true, name: true, slug: true, icon: true } },
            arrondissement: { select: { id: true, name: true, slug: true } },
            _count: { select: { promotions: true, followers: true, reviews: true } },
          },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          skip, take: limit,
        }),
        prisma.shop.count({ where: shopWhere }),
      ])

      return NextResponse.json({
        results: shops,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        type: "shops",
      })
    }

    // Default: search promotions
    const promoWhere: any = { status: "APPROVED" }

    if (q) {
      promoWhere.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { shop: { name: { contains: q, mode: "insensitive" } } },
      ]
    }
    if (category) promoWhere.category = { slug: category }
    if (arrondissement) promoWhere.shop = { arrondissement: { slug: arrondissement } }
    if (minPrice || maxPrice) {
      promoWhere.newPrice = {}
      if (minPrice) promoWhere.newPrice.gte = parseFloat(minPrice)
      if (maxPrice) promoWhere.newPrice.lte = parseFloat(maxPrice)
    }
    if (minDiscount) promoWhere.discountPercentage = { gte: parseFloat(minDiscount) }

    const orderBy: any = {}
    if (sortBy === "discount") orderBy.discountPercentage = "desc"
    else if (sortBy === "price_asc") orderBy.newPrice = "asc"
    else if (sortBy === "price_desc") orderBy.newPrice = "desc"
    else orderBy.createdAt = "desc"

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where: promoWhere,
        include: {
          shop: {
            select: {
              id: true, name: true, slug: true, logo: true, address: true,
              district: true, isVerified: true, isFeatured: true,
              arrondissement: { select: { id: true, name: true, slug: true } },
            },
          },
          category: { select: { id: true, name: true, slug: true, icon: true } },
          media: { orderBy: { displayOrder: "asc" }, take: 1 },
          _count: { select: { favorites: true } },
        },
        orderBy,
        skip, take: limit,
      }),
      prisma.promotion.count({ where: promoWhere }),
    ])

    return NextResponse.json({
      results: promotions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      type: "promotions",
    })
  } catch (error) {
    console.error("Erreur recherche:", error)
    return NextResponse.json({ error: "Erreur de recherche" }, { status: 500 })
  }
}