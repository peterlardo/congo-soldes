import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { slugify, calculerReduction } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    // Single promotion by slug
    if (slug) {
      const promotion = await prisma.promotion.findUnique({
        where: { slug },
        include: {
          shop: {
            include: {
              arrondissement: { select: { id: true, name: true, slug: true } },
              _count: { select: { promotions: true, followers: true, reviews: true } },
            },
          },
          category: { select: { id: true, name: true, slug: true } },
          media: { orderBy: { displayOrder: "asc" } },
        },
      })
      if (!promotion) return NextResponse.json({ error: "Promotion non trouvée" }, { status: 404 })
      return NextResponse.json(promotion)
    }

    const category = searchParams.get("category")
    const arrondissement = searchParams.get("arrondissement")
    const shop = searchParams.get("shop")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minDiscount = searchParams.get("minDiscount")
    const featured = searchParams.get("featured")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = { status: "APPROVED" }

    if (category) {
      where.category = { slug: category }
    }

    if (arrondissement) {
      where.shop = { ...(where.shop || {}), arrondissement: { slug: arrondissement } }
    }

    if (shop) {
      where.shop = { ...(where.shop || {}), slug: shop }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shop: { name: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (minPrice || maxPrice) {
      where.newPrice = {}
      if (minPrice) where.newPrice.gte = parseFloat(minPrice)
      if (maxPrice) where.newPrice.lte = parseFloat(maxPrice)
    }

    if (minDiscount) {
      where.discountPercentage = { gte: parseFloat(minDiscount) }
    }

    if (featured === "true") {
      where.visibility = { in: ["FEATURED", "SPONSORED"] }
    }

    const orderBy: any = {}
    if (sortBy === "discount") orderBy.discountPercentage = "desc"
    else if (sortBy === "price_asc") orderBy.newPrice = "asc"
    else if (sortBy === "price_desc") orderBy.newPrice = "desc"
    else if (sortBy === "views") orderBy.viewsCount = "desc"
    else orderBy.createdAt = "desc"

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
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
    console.error("Erreur récupération promotions:", error)
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "MERCHANT" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
      include: { subscription: { include: { plan: true } } },
    })

    if (!shop) {
      return NextResponse.json({ error: "Aucune boutique trouvée" }, { status: 400 })
    }

    if (shop.status !== "APPROVED" && shop.status !== "ACTIVE") {
      return NextResponse.json({ error: "Boutique non approuvée" }, { status: 403 })
    }

    const activePromoCount = await prisma.promotion.count({
      where: { shopId: shop.id, status: { in: ["ACTIVE", "APPROVED"] } },
    })

    const subscription = shop.subscription
    if (subscription && subscription.plan.promotionLimit > 0 && activePromoCount >= subscription.plan.promotionLimit) {
      return NextResponse.json({
        error: "Limite de promotions atteinte pour votre abonnement",
      }, { status: 400 })
    }

    const slug = `${slugify(body.title)}-${Date.now().toString(36)}`
    const discount = body.oldPrice > 0
      ? Math.round(((body.oldPrice - body.newPrice) / body.oldPrice) * 100)
      : 0

    const promotion = await prisma.promotion.create({
      data: {
        shopId: shop.id,
        categoryId: body.categoryId,
        subCategoryId: body.subCategoryId || null,
        title: body.title,
        slug,
        description: body.description || null,
        shortDescription: body.shortDescription || null,
        oldPrice: parseFloat(body.oldPrice),
        newPrice: parseFloat(body.newPrice),
        discountPercentage: discount,
        stockQuantity: body.stockQuantity ? parseInt(body.stockQuantity) : null,
        startDate: new Date(body.startDate || Date.now()),
        endDate: new Date(body.endDate),
        conditions: body.conditions || null,
        status: session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "APPROVED" : "PENDING_APPROVAL",
      },
    })

    if (body.media && body.media.length > 0) {
      await prisma.promotionMedia.createMany({
        data: body.media.map((url: string, index: number) => ({
          promotionId: promotion.id,
          mediaType: "IMAGE",
          fileUrl: url,
          displayOrder: index,
        })),
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_PROMOTION",
        entityType: "Promotion",
        entityId: promotion.id,
        newValues: { title: body.title, status: promotion.status },
      },
    })

    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    console.error("Erreur création promotion:", error)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}