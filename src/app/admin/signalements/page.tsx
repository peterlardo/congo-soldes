"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

const SIGNALEMENTS = [
  { date: "2026-07-15", promotion: "Smartphone Samsung A54 - 50%", signalePar: "client@email.cg", raison: "Prix non conforme aux conditions", statut: "EN_COURS" },
  { date: "2026-07-14", promotion: "Pack Alimentaire Familial", signalePar: "jean@email.cg", raison: "Publicité mensongère", statut: "EN_COURS" },
  { date: "2026-07-12", promotion: "Canapé Cuir 3 places", signalePar: "marie@email.cg", raison: "Produit indisponible en stock", statut: "RESOLU" },
  { date: "2026-07-10", promotion: "Parfum Iconique - 30%", signalePar: "admin@congosoldes.cg", raison: "Contenu inapproprié", statut: "REJETE" },
  { date: "2026-07-08", promotion: "Climatiseur 12000 BTU", signalePar: "pierre@email.cg", raison: "Information trompeuse sur la réduction", statut: "EN_COURS" },
  { date: "2026-07-05", promotion: "Lot chaussures de sport", signalePar: "client@email.cg", raison: "Arnaque signalée par plusieurs utilisateurs", statut: "RESOLU" },
]

export default function AdminSignalementsPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Gestion des signalements</h1>
          <p className="mt-1 text-gray-600">{SIGNALEMENTS.length} signalements reçus</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Date</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Promotion</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Signalé par</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Raison</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SIGNALEMENTS.map((s, i) => (
                  <tr key={i} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{s.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.promotion}</td>
                    <td className="px-4 py-3 text-gray-500">{s.signalePar}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                        <span className="text-gray-600">{s.raison}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        s.statut === "RESOLU" ? "badge-success" :
                        s.statut === "EN_COURS" ? "badge-warning" : "badge-danger"
                      }`}>
                        {s.statut === "RESOLU" ? "Résolu" : s.statut === "EN_COURS" ? "En cours" : "Rejeté"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100 transition-colors" title="Résoudre">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors" title="Rejeter">
                          <XCircle className="h-4 w-4" />
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
