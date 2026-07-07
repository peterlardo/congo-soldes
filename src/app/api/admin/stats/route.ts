import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const [
      totalUsers,
      totalCommercants,
      totalBoutiques,
      totalPromotions,
      promosActives,
      promosEnAttente,
      totalPaiements,
      totalSignalements,
      totalVues,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "COMMERCANT" } }),
      prisma.boutique.count(),
      prisma.promotion.count(),
      prisma.promotion.count({ where: { statut: "ACTIF" } }),
      prisma.promotion.count({ where: { statut: "EN_ATTENTE" } }),
      prisma.paiement.count(),
      prisma.signalement.count({ where: { statut: "EN_ATTENTE" } }),
      prisma.promotion.aggregate({ _sum: { nombreVues: true } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalCommercants,
      totalBoutiques,
      totalPromotions,
      promosActives,
      promosEnAttente,
      totalPaiements,
      totalSignalements,
      totalVues: totalVues._sum.nombreVues || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
