"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Search, CheckCircle, XCircle, Eye } from "lucide-react"

export default function AdminPromotionsPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  const promos = [
    { nom: "Smartphone Samsung A54", boutique: "Tech Store Congo", date: "2026-07-15", statut: "EN_ATTENTE" },
    { nom: "Pack Familial", boutique: "Super Marché Express", date: "2026-07-14", statut: "EN_ATTENTE" },
    { nom: "Canapé Cuir", boutique: "Maison & Déco", date: "2026-07-13", statut: "EN_ATTENTE" },
    { nom: "Parfum Iconique", boutique: "Beauty Palace", date: "2026-07-10", statut: "ACTIF" },
    { nom: "Climatiseur 12000 BTU", boutique: "Electro Shop", date: "2026-07-08", statut: "ACTIF" },
    { nom: "Lot chaussures", boutique: "Shoe Store", date: "2026-07-05", statut: "REJETE" },
  ]

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Modération des promotions</h1>
            <p className="mt-1 text-gray-600">Validez ou rejetez les promotions soumises</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9 w-64" placeholder="Rechercher..." />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Promotion</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Boutique</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {promos.map((promo, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-dark">{promo.nom}</td>
                    <td className="px-4 py-3 text-gray-600">{promo.boutique}</td>
                    <td className="px-4 py-3 text-gray-600">{promo.date}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        promo.statut === "ACTIF" ? "badge-success" :
                        promo.statut === "EN_ATTENTE" ? "badge-warning" : "badge-danger"
                      }`}>
                        {promo.statut === "ACTIF" ? "Actif" : promo.statut === "EN_ATTENTE" ? "En attente" : "Rejeté"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100" title="Approuver">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100" title="Rejeter">
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
