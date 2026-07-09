"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Search, CheckCircle, Ban, Trash2, Store } from "lucide-react"

const COMMERCANTS = [
  { nom: "Jean Mbemba", email: "jean.mbemba@email.cg", boutique: "Tech Store Congo", abonnement: "PREMIUM", actif: true },
  { nom: "Marie Nkosi", email: "marie.nkosi@email.cg", boutique: "Beauty Palace", abonnement: "STANDARD", actif: true },
  { nom: "Pierre Makaya", email: "pierre.makaya@email.cg", boutique: "Super Marché Express", abonnement: "GRATUIT", actif: true },
  { nom: "Alice Bouanga", email: "alice.bouanga@email.cg", boutique: "Maison & Déco", abonnement: "ENTREPRISE", actif: false },
  { nom: "David Ngoma", email: "david.ngoma@email.cg", boutique: "Electro Shop", abonnement: "PREMIUM", actif: true },
  { nom: "Sarah Mbenza", email: "sarah.mbenza@email.cg", boutique: "Shoe Store Congo", abonnement: "STANDARD", actif: false },
  { nom: "Paul Kibangou", email: "paul.kibangou@email.cg", boutique: "Librairie Centrale", abonnement: "GRATUIT", actif: true },
]

export default function AdminCommercantsPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Gestion des commerçants</h1>
            <p className="mt-1 text-gray-600">{COMMERCANTS.length} commerçants enregistrés</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9 w-64" placeholder="Rechercher un commerçant..." />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Commerçant</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Email</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Boutique</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Abonnement</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMMERCANTS.map((c, i) => (
                  <tr key={i} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                          <Store className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900">{c.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.boutique}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        c.abonnement === "PREMIUM" ? "badge-primary" :
                        c.abonnement === "ENTREPRISE" ? "badge-info" :
                        c.abonnement === "STANDARD" ? "badge-success" : "badge-warning"
                      }`}>
                        {c.abonnement}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${c.actif ? "badge-success" : "badge-danger"}`}>
                        {c.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100 transition-colors" title="Approuver">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-yellow-50 p-1.5 text-yellow-600 hover:bg-yellow-100 transition-colors" title="Bloquer">
                          <Ban className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
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
