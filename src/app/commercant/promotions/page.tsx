"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Search, Plus, Eye, MapPin, Tag } from "lucide-react"
import { cn, getStatutLabel } from "@/lib/utils"

const MES_PROMOTIONS = [
  { id: 1, nom: "Smartphone Samsung Galaxy A54 128GB", categorie: "Téléphones et accessoires", dateDebut: "2026-07-15", dateFin: "2026-08-15", vues: 234, statut: "ACTIF" },
  { id: 2, nom: "Pack Alimentaire Familial 50kg", categorie: "Alimentation", dateDebut: "2026-07-14", dateFin: "2026-08-14", vues: 189, statut: "ACTIF" },
  { id: 3, nom: "Canapé Cuir 3 places Premium", categorie: "Meubles et décoration", dateDebut: "2026-07-20", dateFin: "2026-08-20", vues: 0, statut: "EN_ATTENTE" },
  { id: 4, nom: "Parfum Iconique 100ml", categorie: "Beauté et cosmétique", dateDebut: "2026-06-01", dateFin: "2026-07-01", vues: 567, statut: "EXPIRE" },
  { id: 5, nom: "Climatiseur 12000 BTU Inverter", categorie: "Électroménager", dateDebut: "2026-07-10", dateFin: "2026-08-10", vues: 98, statut: "ACTIF" },
  { id: 6, nom: "Lot de 10 T-shirts Coton Bio", categorie: "Mode et vêtements", dateDebut: "2026-07-22", dateFin: "2026-08-22", vues: 0, statut: "EN_ATTENTE" },
  { id: 7, nom: "Abonnement Internet 100Mbps", categorie: "Services", dateDebut: "2026-06-15", dateFin: "2026-07-15", vues: 45, statut: "EXPIRE" },
  { id: 8, nom: "Chaussures de Sport Nike Air", categorie: "Chaussures", dateDebut: "2026-07-05", dateFin: "2026-08-05", vues: 312, statut: "ACTIF" },
  { id: 9, nom: "Lave-linge 7kg Samsung", categorie: "Électroménager", dateDebut: "2026-07-18", dateFin: "2026-08-18", vues: 0, statut: "REJETE" },
  { id: 10, nom: "Cours de Langue Anglais en Ligne", categorie: "Services", dateDebut: "2026-07-01", dateFin: "2026-08-01", vues: 76, statut: "ACTIF" },
]

export default function CommercantPromotionsPage() {
  const { data: session } = useSession()
  const [recherche, setRecherche] = useState("")

  if (!session || session.user.role !== "COMMERCANT") redirect("/auth/connexion")

  const filtrees = MES_PROMOTIONS.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Mes promotions</h1>
            <p className="mt-1 text-gray-600">{MES_PROMOTIONS.length} promotion(s) créée(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-9 w-64"
                placeholder="Rechercher une promotion..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
            <Link href="/commercant/promotions/nouvelle" className="btn-primary">
              <Plus className="h-4 w-4" />
              Nouvelle promotion
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Titre</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Catégorie</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Date</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Vues</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrees.map((promo) => (
                  <tr key={promo.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                          <Tag className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900">{promo.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{promo.categorie}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {promo.dateDebut} — {promo.dateFin}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{promo.vues}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "badge",
                        promo.statut === "ACTIF" && "badge-success",
                        promo.statut === "EN_ATTENTE" && "badge-warning",
                        promo.statut === "REJETE" && "badge-danger",
                        promo.statut === "EXPIRE" && "badge-danger",
                      )}>
                        {getStatutLabel(promo.statut)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtrees.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Aucune promotion trouvée pour "{recherche}"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
