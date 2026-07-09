import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId")

    if (!shopId) {
      return NextResponse.json({ error: "shopId requis" }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { shopId, status: "APPROVED" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const stats = await prisma.review.aggregate({
      where: { shopId, status: "APPROVED" },
      _avg: { rating: true, serviceRating: true, qualityRating: true, priceRating: true },
      _count: true,
    })

    return NextResponse.json({ reviews, stats })
  } catch (error) {
    console.error("Erreur reviews:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { shopId, rating, comment, serviceRating, qualityRating, priceRating } = body

    if (!shopId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Note requise (1-5)" }, { status: 400 })
    }

    const existing = await prisma.review.findUnique({
      where: { userId_shopId: { userId: session.user.id, shopId } },
    })
    if (existing) {
      return NextResponse.json({ error: "Vous avez déjà noté cette boutique" }, { status: 409 })
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        shopId,
        rating,
        comment: comment || null,
        serviceRating: serviceRating || null,
        qualityRating: qualityRating || null,
        priceRating: priceRating || null,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Erreur création review:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { reviewId, rating, comment, serviceRating, qualityRating, priceRating } = body

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })
    if (!review || review.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating ?? review.rating,
        comment: comment ?? review.comment,
        serviceRating: serviceRating ?? review.serviceRating,
        qualityRating: qualityRating ?? review.qualityRating,
        priceRating: priceRating ?? review.priceRating,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Erreur maj review:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("id")

    if (!reviewId) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 })
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })
    if (!review || review.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    await prisma.review.delete({ where: { id: reviewId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur suppression review:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}