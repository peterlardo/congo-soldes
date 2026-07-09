"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Heart, Store, Search, MapPin, Tag } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"

const boutiques = [
  { id: 1, nom: "Electro Congo", description: "Spécialiste en électroménager et électronique à Brazzaville", promotions: 8, ville: "Brazzaville" },
  { id: 2, nom: "Mode Africa", description: "Vêtements tendance et accessoires pour toute la famille", promotions: 5, ville: "Pointe-Noire" },
  { id: 3, nom: "Sport & Loisirs", description: "Équipements sportifs et articles de plein air", promotions: 12, ville: "Brazzaville" },
  { id: 4, nom: "Maison Congo", description: "Mobilier et décoration intérieure made in Congo", promotions: 3, ville: "Dolisie" },
]

export default function BoutiquesSuiviesPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "CLIENT") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="client" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Store className="h-6 w-6 text-primary-500" />
            <h1 className="font-display text-2xl font-bold text-dark">Boutiques suivies</h1>
          </div>
          <p className="mt-1 text-gray-600">Gérez les boutiques que vous suivez</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Rechercher une boutique..." />
        </div>

        {boutiques.length === 0 ? (
          <div className="card flex flex-col items-center py-16">
            <Store className="mb-4 h-16 w-16 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">Vous ne suivez aucune boutique pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boutiques.map((boutique) => (
              <div key={boutique.id} className="card p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                    <Store className="h-6 w-6" />
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100">
                    <Heart className="h-4 w-4 fill-red-500" />
                  </button>
                </div>
                <h3 className="mb-1 font-semibold text-dark">{boutique.nom}</h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2">{boutique.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {boutique.ville}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> {boutique.promotions} promotions
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
