import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const arrondissement = searchParams.get("arrondissement")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = { status: { in: ["APPROVED", "ACTIVE"] } }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
      ]
    }

    if (arrondissement) {
      where.arrondissement = { slug: arrondissement }
    }

    if (category) {
      where.category = { slug: category }
    }

    if (featured === "true") {
      where.isFeatured = true
    }

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true } },
          arrondissement: { select: { id: true, name: true, slug: true } },
          _count: { select: { promotions: true, followers: true, reviews: true } },
        },
        orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.shop.count({ where }),
    ])

    return NextResponse.json({
      shops,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Erreur récupération boutiques:", error)
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "MERCHANT" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()

    const shop = await prisma.shop.update({
      where: { ownerId: session.user.id },
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        district: body.district,
        arrondissementId: body.arrondissementId || null,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        website: body.website,
        openingHours: body.openingHours ? JSON.parse(body.openingHours) : undefined,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        tiktokUrl: body.tiktokUrl,
        categoryId: body.categoryId || null,
        latitude: body.latitude ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude ? parseFloat(body.longitude) : undefined,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_SHOP",
        entityType: "Shop",
        entityId: shop.id,
        newValues: { name: body.name },
      },
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Erreur mise à jour boutique:", error)
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 })
  }
}