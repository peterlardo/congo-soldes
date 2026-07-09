"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Plus, Pencil, Trash2, MapPin } from "lucide-react"

const VILLES = [
  { nom: "Brazzaville", region: "Pool", boutiques: 48, actif: true },
  { nom: "Pointe-Noire", region: "Kouilou", boutiques: 35, actif: true },
  { nom: "Dolisie", region: "Niari", boutiques: 12, actif: true },
  { nom: "Nkayi", region: "Bouenza", boutiques: 7, actif: false },
  { nom: "Owando", region: "Cuvette", boutiques: 5, actif: true },
  { nom: "Ouesso", region: "Sangha", boutiques: 4, actif: false },
  { nom: "Madingou", region: "Bouenza", boutiques: 3, actif: true },
]

export default function AdminVillesPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Gestion des villes</h1>
            <p className="mt-1 text-gray-600">{VILLES.length} villes couvertes</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>

        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-dark">Ajouter une nouvelle ville</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label-field">Nom de la ville</label>
              <input className="input-field" placeholder="Ex: Brazzaville" />
            </div>
            <div>
              <label className="label-field">Région</label>
              <input className="input-field" placeholder="Ex: Pool" />
            </div>
            <div className="flex items-end">
              <button className="btn-primary w-full">
                <Plus className="h-4 w-4" /> Ajouter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Ville</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Région</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Boutiques</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {VILLES.map((v, i) => (
                  <tr key={i} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900">{v.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{v.region}</td>
                    <td className="px-4 py-3">
                      <span className="flex h-6 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">{v.boutiques}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${v.actif ? "badge-success" : "badge-danger"}`}>
                        {v.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-primary-50 p-1.5 text-primary-600 hover:bg-primary-100 transition-colors" title="Modifier">
                          <Pencil className="h-4 w-4" />
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
