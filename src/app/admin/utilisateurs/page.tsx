"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Search, Shield, Ban, Trash2 } from "lucide-react"

export default function AdminUtilisateursPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  const utilisateurs = [
    { nom: "Jean Mbemba", email: "jean@email.com", role: "COMMERCANT", date: "2026-06-01", actif: true },
    { nom: "Marie Nkosi", email: "marie@email.com", role: "CLIENT", date: "2026-06-15", actif: true },
    { nom: "Pierre Makaya", email: "pierre@email.com", role: "COMMERCANT", date: "2026-05-20", actif: false },
    { nom: "Alice Bouanga", email: "alice@email.com", role: "CLIENT", date: "2026-07-01", actif: true },
  ]

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Gestion des utilisateurs</h1>
            <p className="mt-1 text-gray-600">{utilisateurs.length} utilisateurs enregistrés</p>
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
                  <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Rôle</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Inscription</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {utilisateurs.map((user, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-dark">{user.nom}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.role === "ADMIN" ? "badge-primary" : user.role === "COMMERCANT" ? "badge-info" : "badge-success"}`}>
                        {user.role === "COMMERCANT" ? "Commerçant" : user.role === "ADMIN" ? "Admin" : "Client"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.date}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.actif ? "badge-success" : "badge-danger"}`}>
                        {user.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100" title="Admin">
                          <Shield className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-yellow-50 p-1.5 text-yellow-600 hover:bg-yellow-100" title="Bloquer">
                          <Ban className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100" title="Supprimer">
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
