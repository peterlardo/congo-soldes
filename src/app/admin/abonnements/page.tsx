"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { CreditCard } from "lucide-react"

const ABONNEMENTS = [
  { commercant: "Tech Store Congo", type: "PREMIUM", prix: "35 000 FCFA", debut: "2026-01-15", fin: "2026-07-15", actif: true },
  { commercant: "Beauty Palace", type: "STANDARD", prix: "15 000 FCFA", debut: "2026-03-01", fin: "2026-09-01", actif: true },
  { commercant: "Super Marché Express", type: "GRATUIT", prix: "0 FCFA", debut: "2026-06-01", fin: "2026-12-01", actif: true },
  { commercant: "Maison & Déco", type: "ENTREPRISE", prix: "75 000 FCFA", debut: "2026-02-01", fin: "2026-05-01", actif: false },
  { commercant: "Electro Shop", type: "PREMIUM", prix: "35 000 FCFA", debut: "2026-04-10", fin: "2026-10-10", actif: true },
  { commercant: "Shoe Store Congo", type: "STANDARD", prix: "15 000 FCFA", debut: "2026-01-01", fin: "2026-04-01", actif: false },
  { commercant: "Librairie Centrale", type: "GRATUIT", prix: "0 FCFA", debut: "2026-05-15", fin: "2026-11-15", actif: true },
  { commercant: "Restaurant Saveurs", type: "PREMIUM", prix: "35 000 FCFA", debut: "2026-06-01", fin: "2026-07-01", actif: true },
]

export default function AdminAbonnementsPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Gestion des abonnements</h1>
            <p className="mt-1 text-gray-600">{ABONNEMENTS.length} abonnements sur la plateforme</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 transition-colors">Tous</button>
            <button className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-100 transition-colors">Actifs</button>
            <button className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">Expirés</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Commerçant</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Type</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Prix</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Début</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Fin</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ABONNEMENTS.map((a, i) => (
                  <tr key={i} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900">{a.commercant}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        a.type === "PREMIUM" ? "badge-primary" :
                        a.type === "ENTREPRISE" ? "badge-info" :
                        a.type === "STANDARD" ? "badge-success" : "badge-warning"
                      }`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.prix}</td>
                    <td className="px-4 py-3 text-gray-500">{a.debut}</td>
                    <td className="px-4 py-3 text-gray-500">{a.fin}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${a.actif ? "badge-success" : "badge-danger"}`}>
                        {a.actif ? "Actif" : "Expiré"}
                      </span>
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
