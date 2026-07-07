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

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Icône</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Slug</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Ordre</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CATEGORIES.map((cat, i) => (
                  <tr key={cat.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xl">{cat.icone}</td>
                    <td className="px-4 py-3 font-medium text-dark">{cat.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-600">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100">
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
