"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface CmsPage {
  id: string
  title: string
  slug: string
  status: string
  author: { firstName: string; lastName: string } | null
  updatedAt: string
}

export default function AdminCmsPage() {
  const { data: session } = useSession()
  const [pages, setPages] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(true)

  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then(setPages)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette page ?")) return
    await fetch(`/api/admin/cms?id=${id}`, { method: "DELETE" })
    setPages((p) => p.filter((page) => page.id !== id))
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Pages CMS</h1>
            <p className="mt-1 text-gray-600">Gérez les pages de contenu du site</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4" /> Nouvelle page
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Titre</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Slug</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Auteur</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Modifié le</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Chargement...</td></tr>
                ) : pages.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Aucune page</td></tr>
                ) : pages.map((page) => (
                  <tr key={page.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{page.title}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{page.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        page.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {page.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {page.author ? `${page.author.firstName} ${page.author.lastName}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(page.updatedAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-primary-50 p-1.5 text-primary-600 hover:bg-primary-100 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(page.id)} className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors">
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