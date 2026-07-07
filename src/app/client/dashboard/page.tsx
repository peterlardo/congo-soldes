"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Heart, Store, Clock, Eye, Bell, ArrowRight } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { PromotionCard } from "@/components/promotions/PromotionCard"

export default function ClientDashboard() {
  const { data: session } = useSession()

  if (!session) {
    redirect("/auth/connexion")
  }

  if (session.user.role !== "CLIENT") {
    redirect("/")
  }

  const stats = [
    { label: "Favoris", valeur: "12", icone: <Heart className="h-5 w-5" />, couleur: "text-red-500 bg-red-50" },
    { label: "Boutiques suivies", valeur: "5", icone: <Store className="h-5 w-5" />, couleur: "text-primary-500 bg-primary-50" },
    { label: "Consultations", valeur: "48", icone: <Eye className="h-5 w-5" />, couleur: "text-blue-500 bg-blue-50" },
    { label: "Notifications", valeur: "3", icone: <Bell className="h-5 w-5" />, couleur: "text-yellow-500 bg-yellow-50" },
  ]

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="client" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">
            Bonjour, {session.user.name || "Client"}
          </h1>
          <p className="mt-1 text-gray-600">
            Bienvenue sur votre espace personnel
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.couleur}`}>
                  {stat.icone}
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-dark">{stat.valeur}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark">Promotions recommandées</h2>
            <Link href="/promotions" className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <PromotionCard
                key={i}
                id={String(i)}
                nom={`Promotion recommandée ${i}`}
                slug={`promo-${i}`}
                prixNormal={100000}
                prixPromotionnel={75000}
                dateFin="2026-08-15"
                boutiqueNom={`Boutique ${i}`}
                ville="Brazzaville"
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark">Consultations récentes</h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">Promotion exemple {i}</p>
                  <p className="text-xs text-gray-500">Consulté il y a {i}h</p>
                </div>
                <Link href={`/promotions/promo-${i}`} className="text-sm text-primary-500 hover:text-primary-600">
                  Voir
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
