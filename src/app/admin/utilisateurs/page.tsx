"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Search, Shield, Ban, Trash2, Loader2, UserCheck } from "lucide-react"

interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  role: string
  status: string
  createdAt: string
  lastLoginAt?: string | null
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Modérateur",
  MERCHANT: "Commerçant",
  SHOP_MANAGER: "Gestionnaire",
  CLIENT: "Client",
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "badge-danger",
  ADMIN: "badge-primary",
  MODERATOR: "badge-warning",
  MERCHANT: "badge-info",
  SHOP_MANAGER: "badge-primary",
  CLIENT: "badge-success",
}

export default function AdminUtilisateursPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { setUsers(data.users || data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/connexion")
  }

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)))
    } catch (e) { console.error(e) }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Confirmer la suppression de cet utilisateur ?")) return
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      })
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Gestion des utilisateurs</h1>
            <p className="mt-1 text-gray-600">{users.length} utilisateurs enregistrés</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9 w-64" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Utilisateur</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email / Téléphone</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Rôle</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Inscription</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Dernière connexion</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                            {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                          </div>
                          <span className="font-medium text-dark">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-600">{user.email}</p>
                        {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${ROLE_COLORS[user.role] || "badge-info"}`}>{ROLE_LABELS[user.role] || user.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${user.status === "ACTIVE" ? "badge-success" : user.status === "SUSPENDED" ? "badge-danger" : "badge-warning"}`}>
                          {user.status === "ACTIVE" ? "Actif" : user.status === "SUSPENDED" ? "Suspendu" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("fr-FR") : "Jamais"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => handleUpdateStatus(user.id, user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}
                            className={`rounded-lg p-1.5 ${user.status === "ACTIVE" ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                            {user.status === "ACTIVE" ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (<tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">Aucun utilisateur trouvé</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
