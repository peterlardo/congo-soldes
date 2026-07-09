"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Heart } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { PromotionCard } from "@/components/promotions/PromotionCard"

export default function FavorisPage() {
  const { data: session } = useSession()

  if (!session || session.user.role !== "CLIENT") {
    redirect("/auth/connexion")
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="client" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-dark">Mes favoris</h1>
              <p className="text-sm text-gray-600">Retrouvez toutes vos promotions favorites</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PromotionCard
              key={i}
              id={String(i)}
              nom={`Promotion favorite ${i}`}
              slug={`promo-fav-${i}`}
              prixNormal={85000 + i * 10000}
              prixPromotionnel={55000 + i * 5000}
              dateFin="2026-08-20"
              boutiqueNom={`Boutique ${i}`}
              ville="Brazzaville"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
