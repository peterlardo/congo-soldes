"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Banner {
  id: string
  title: string
  imageUrl: string
  placement: string
  status: string
  startDate: string
  endDate: string | null
  author: { firstName: string; lastName: string } | null
}

export default function AdminBannersPage() {
  const { data: session } = useSession()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  useEffect(() => {
    fetch("/api/admin/banners")
      .then((r) => r.json())
      .then(setBanners)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette bannière ?")) return
    await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" })
    setBanners((b) => b.filter((bn) => bn.id !== id))
  }

  const getPlacementLabel = (placement: string) => {
    const labels: Record<string, string> = {
      HOME_HERO: "Hero Accueil",
      HOME_PROMOS: "Promotions Accueil",
      SIDEBAR: "Barre latérale",
      POPUP: "Popup",
    }
    return labels[placement] || placement
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Bannières publicitaires</h1>
            <p className="mt-1 text-gray-600">Gérez les bannières et espaces publicitaires</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4" /> Nouvelle bannière
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Titre</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Placement</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Début</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Fin</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Chargement...</td></tr>
                ) : banners.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Aucune bannière</td></tr>
                ) : banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{banner.title}</td>
                    <td className="px-4 py-3 text-gray-600">{getPlacementLabel(banner.placement)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        banner.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {banner.status === "ACTIVE" ? "Actif" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(banner.startDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {banner.endDate ? new Date(banner.endDate).toLocaleDateString("fr-FR") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-primary-50 p-1.5 text-primary-600 hover:bg-primary-100 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(banner.id)} className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors">
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