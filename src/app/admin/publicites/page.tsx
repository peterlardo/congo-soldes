"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Plus, Eye, PauseCircle, Trash2, Image as ImageIcon } from "lucide-react"

const PUBLICITES = [
  { id: 1, commercant: "Tech Store Congo", debut: "2026-07-01", fin: "2026-07-31", statut: "ACTIF" },
  { id: 2, commercant: "Beauty Palace", debut: "2026-06-15", fin: "2026-07-15", statut: "ACTIF" },
  { id: 3, commercant: "Electro Shop", debut: "2026-07-10", fin: "2026-08-10", statut: "ACTIF" },
  { id: 4, commercant: "Maison & Déco", debut: "2026-05-01", fin: "2026-06-01", statut: "TERMINE" },
  { id: 5, commercant: "Restaurant Saveurs", debut: "2026-07-20", fin: "2026-08-20", statut: "EN_ATTENTE" },
  { id: 6, commercant: "Shoe Store Congo", debut: "2026-04-01", fin: "2026-05-01", statut: "TERMINE" },
]

export default function AdminPublicitesPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Gestion des publicités</h1>
            <p className="mt-1 text-gray-600">{PUBLICITES.length} campagnes publicitaires</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLICITES.map((pub) => (
            <div key={pub.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg">
              <div className="h-24 bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-dark">{pub.commercant}</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Début</span>
                    <span className="font-medium text-gray-700">{pub.debut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fin</span>
                    <span className="font-medium text-gray-700">{pub.fin}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`badge ${
                    pub.statut === "ACTIF" ? "badge-success" :
                    pub.statut === "EN_ATTENTE" ? "badge-warning" : "badge-danger"
                  }`}>
                    {pub.statut === "ACTIF" ? "Actif" : pub.statut === "EN_ATTENTE" ? "En attente" : "Terminé"}
                  </span>
                  <div className="flex gap-1">
                    <button className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 transition-colors" title="Voir">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-yellow-50 p-1.5 text-yellow-600 hover:bg-yellow-100 transition-colors" title="Mettre en pause">
                      <PauseCircle className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors" title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
