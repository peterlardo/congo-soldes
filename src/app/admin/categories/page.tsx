"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { CATEGORIES } from "@/lib/utils"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function AdminCategoriesPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Gestion des catégories</h1>
            <p className="mt-1 text-gray-600">Gérez les catégories de promotions</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Icône</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Nom</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Slug</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Ordre</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CATEGORIES.map((cat, i) => (
                  <tr key={cat.slug} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3 text-xl">{cat.icone}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.nom}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">{i + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-primary-50 p-1.5 text-primary-600 hover:bg-primary-100 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors">
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
