"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from "lucide-react"

const PAIEMENTS = [
  { date: "2026-07-15", commercant: "Tech Store Congo", transaction: "TXN-001-2026", methode: "Mobile Money", montant: "35 000 FCFA", statut: "VALIDE" },
  { date: "2026-07-14", commercant: "Beauty Palace", transaction: "TXN-002-2026", methode: "Mobile Money", montant: "15 000 FCFA", statut: "VALIDE" },
  { date: "2026-07-12", commercant: "Electro Shop", transaction: "TXN-003-2026", methode: "Carte", montant: "35 000 FCFA", statut: "VALIDE" },
  { date: "2026-07-10", commercant: "Maison & Déco", transaction: "TXN-004-2026", methode: "Mobile Money", montant: "75 000 FCFA", statut: "ECHEC" },
  { date: "2026-07-08", commercant: "Shoe Store Congo", transaction: "TXN-005-2026", methode: "Carte", montant: "15 000 FCFA", statut: "REMBOURSE" },
  { date: "2026-07-05", commercant: "Restaurant Saveurs", transaction: "TXN-006-2026", methode: "Mobile Money", montant: "35 000 FCFA", statut: "VALIDE" },
  { date: "2026-07-03", commercant: "Super Marché Express", transaction: "TXN-007-2026", methode: "Mobile Money", montant: "0 FCFA", statut: "VALIDE" },
  { date: "2026-07-01", commercant: "Librairie Centrale", transaction: "TXN-008-2026", methode: "Carte", montant: "0 FCFA", statut: "VALIDE" },
]

export default function AdminPaiementsPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Historique des paiements</h1>
          <p className="mt-1 text-gray-600">Suivez les transactions et revenus</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="card-primary p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-dark">210 000 FCFA</p>
            <p className="text-sm text-gray-500">Revenus du mois</p>
          </div>
          <div className="card-secondary p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-dark">8</p>
            <p className="text-sm text-gray-500">Transactions</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-purple-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-dark">26 250 FCFA</p>
            <p className="text-sm text-gray-500">Moyenne par transaction</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-primary-800">Date</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Commerçant</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Transaction</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Méthode</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Montant</th>
                  <th className="px-4 py-3 font-medium text-primary-800">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PAIEMENTS.map((p, i) => (
                  <tr key={i} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{p.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.commercant}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.transaction}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.methode === "Mobile Money" ? "badge-info" : "badge-primary"}`}>
                        {p.methode}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.montant}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        p.statut === "VALIDE" ? "badge-success" :
                        p.statut === "ECHEC" ? "badge-danger" : "badge-warning"
                      }`}>
                        {p.statut === "VALIDE" ? "Validé" : p.statut === "ECHEC" ? "Échec" : "Remboursé"}
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
