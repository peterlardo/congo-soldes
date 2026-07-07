"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Users, Store, Tag, CreditCard, TrendingUp, AlertTriangle,
  CheckCircle, Clock, DollarSign, BarChart3, Eye, MessageSquare
} from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"

export default function AdminDashboard() {
  const { data: session } = useSession()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/connexion")
  }

  const stats = [
    { label: "Utilisateurs", valeur: "1,234", icone: <Users className="h-5 w-5" />, couleur: "text-blue-500 bg-blue-50", lien: "/admin/utilisateurs" },
    { label: "Boutiques", valeur: "156", icone: <Store className="h-5 w-5" />, couleur: "text-primary-500 bg-primary-50", lien: "/admin/commercants" },
    { label: "Promotions", valeur: "892", icone: <Tag className="h-5 w-5" />, couleur: "text-green-500 bg-green-50", lien: "/admin/promotions" },
    { label: "En attente", valeur: "23", icone: <Clock className="h-5 w-5" />, couleur: "text-yellow-500 bg-yellow-50", lien: "/admin/promotions" },
    { label: "Revenus (mois)", valeur: "450 000 FCFA", icone: <DollarSign className="h-5 w-5" />, couleur: "text-green-500 bg-green-50", lien: "/admin/paiements" },
    { label: "Abonnements actifs", valeur: "89", icone: <CreditCard className="h-5 w-5" />, couleur: "text-purple-500 bg-purple-50", lien: "/admin/abonnements" },
    { label: "Signalements", valeur: "7", icone: <AlertTriangle className="h-5 w-5" />, couleur: "text-red-500 bg-red-50", lien: "/admin/signalements" },
    { label: "Vues (mois)", valeur: "45 678", icone: <Eye className="h-5 w-5" />, couleur: "text-secondary-500 bg-secondary-50", lien: "/admin/statistiques" },
  ]

  const recentActivites = [
    { action: "Nouvelle boutique inscrite", details: "Tech Store Congo", date: "Il y a 5 min" },
    { action: "Promotion en attente", details: "Smartphone Samsung A54", date: "Il y a 15 min" },
    { action: "Paiement reçu", details: "Abonnement Premium - 35 000 FCFA", date: "Il y a 1h" },
    { action: "Signalement soumis", details: "Promotion suspecte #452", date: "Il y a 2h" },
    { action: "Nouvel utilisateur inscrit", details: "client@email.com", date: "Il y a 3h" },
  ]

  const promosAttente = [
    { nom: "Smartphone Samsung A54", boutique: "Tech Store Congo", date: "2026-07-15" },
    { nom: "Pack Alimentaire Familial", boutique: "Super Marché Express", date: "2026-07-14" },
    { nom: "Canapé Cuir 3 places", boutique: "Maison & Déco", date: "2026-07-13" },
  ]

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">
            Administration Congo Soldes
          </h1>
          <p className="mt-1 text-gray-600">
            Gérez l&apos;ensemble de la plateforme
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.lien} className="card p-5 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.couleur}`}>
                  {stat.icone}
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-dark">{stat.valeur}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Promotions en attente</h2>
            <div className="space-y-3">
              {promosAttente.map((promo, i) => (
                <div key={i} className="card flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-dark">{promo.nom}</p>
                    <p className="text-xs text-gray-500">{promo.boutique} • {promo.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100">
                      Approuver
                    </button>
                    <button className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
              <Link href="/admin/promotions" className="block text-center text-sm font-medium text-primary-500 hover:text-primary-600">
                Voir toutes les promotions en attente →
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Activités récentes</h2>
            <div className="card divide-y divide-gray-100">
              {recentActivites.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">{act.action}</p>
                    <p className="text-xs text-gray-500">{act.details} • {act.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-dark">Accès rapides</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Gérer les utilisateurs", lien: "/admin/utilisateurs", icone: <Users className="h-5 w-5" />, couleur: "bg-blue-500" },
              { label: "Valider les boutiques", lien: "/admin/commercants", icone: <Store className="h-5 w-5" />, couleur: "bg-primary-500" },
              { label: "Modérer les promotions", lien: "/admin/promotions", icone: <Tag className="h-5 w-5" />, couleur: "bg-green-500" },
              { label: "Gérer les abonnements", lien: "/admin/abonnements", icone: <CreditCard className="h-5 w-5" />, couleur: "bg-purple-500" },
            ].map((item, i) => (
              <Link key={i} href={item.lien} className="card flex items-center gap-4 p-5 transition-all hover:shadow-md">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.couleur}`}>
                  {item.icone}
                </div>
                <span className="text-sm font-medium text-dark">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
