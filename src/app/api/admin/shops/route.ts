import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams?.get("status")
    const pending = searchParams?.get("pending")

    const where: any = {}
    if (status) where.status = status
    if (pending === "true") where.status = "PENDING"

    const shops = await prisma.shop.findMany({
      where,
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        arrondissement: { select: { id: true, name: true } },
        _count: { select: { promotions: true, followers: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ shops })
  } catch (error) {
    console.error("Erreur récupération boutiques admin:", error)
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
    const { id, status, verificationStatus, isVerified, isFeatured, rejectedReason } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (verificationStatus) updateData.verificationStatus = verificationStatus
    if (isVerified !== undefined) updateData.isVerified = isVerified
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured

    const shop = await prisma.shop.update({
      where: { id },
      data: updateData,
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_UPDATE_SHOP",
        entityType: "Shop",
        entityId: id,
        newValues: updateData,
      },
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Erreur mise à jour boutique admin:", error)
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
    await prisma.shop.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_DELETE_SHOP",
        entityType: "Shop",
        entityId: id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur suppression boutique:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}