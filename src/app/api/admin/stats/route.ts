import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      totalShops,
      pendingShops,
      activePromotions,
      expiredPromotions,
      reportedPromotions,
      activeSubscriptions,
      activeCampaigns,
      totalRevenue,
      recentUsers,
      recentPromotions,
      topCategories,
      topArrondissements,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.shop.count(),
      prisma.shop.count({ where: { status: "PENDING" } }),
      prisma.promotion.count({ where: { status: "APPROVED" } }),
      prisma.promotion.count({ where: { status: "EXPIRED" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.shopSubscription.count({ where: { status: "ACTIVE" } }),
      prisma.sponsoredCampaign.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { paymentStatus: "COMPLETED" } }),
      prisma.user.findMany({ where: { createdAt: { gte: thirtyDaysAgo } }, orderBy: { createdAt: "desc" }, take: 30, select: { createdAt: true } }),
      prisma.promotion.findMany({ where: { createdAt: { gte: thirtyDaysAgo } }, orderBy: { createdAt: "desc" }, take: 30, select: { createdAt: true } }),
      prisma.category.findMany({
        include: { _count: { select: { promotions: true } } },
        orderBy: { promotions: { _count: "desc" } },
        take: 10,
      }),
      prisma.arrondissement.findMany({
        include: { _count: { select: { shops: true } } },
        orderBy: { shops: { _count: "desc" } },
        take: 10,
      }),
    ])

    const userGrowth = recentUsers.reduce((acc: Record<string, number>, u) => {
      const date = u.createdAt.toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const promoGrowth = recentPromotions.reduce((acc: Record<string, number>, p) => {
      const date = p.createdAt.toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      totalUsers,
      totalShops,
      pendingShops,
      activePromotions,
      expiredPromotions,
      reportedPromotions,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeSubscriptions,
      activeCampaigns,
      topCategories: topCategories.map(c => ({ name: c.name, count: c._count.promotions })),
      topArrondissements: topArrondissements.map(a => ({ name: a.name, count: a._count.shops })),
      userGrowth: Object.entries(userGrowth).map(([date, count]) => ({ date, count })),
      promoGrowth: Object.entries(promoGrowth).map(([date, count]) => ({ date, count })),
    })
  } catch (error) {
    console.error("Erreur stats admin:", error)
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 })
  }
}