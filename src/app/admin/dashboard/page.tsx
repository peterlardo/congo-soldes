"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Users, Store, Tag, CreditCard, TrendingUp, AlertTriangle, Clock,
  DollarSign, Eye, Building2, ShoppingBag, Loader2, CheckCircle,
  XCircle, BarChart3, Award, MapPin,
} from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"

interface AdminStats {
  totalUsers: number
  totalShops: number
  pendingShops: number
  activePromotions: number
  expiredPromotions: number
  reportedPromotions: number
  totalRevenue: number
  activeSubscriptions: number
  activeCampaigns: number
  topCategories: { name: string; count: number }[]
  topArrondissements: { name: string; count: number }[]
  userGrowth: { date: string; count: number }[]
  promoGrowth: { date: string; count: number }[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (status === "loading") return null
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/connexion")
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh]">
        <DashboardSidebar type="admin" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </div>
    )
  }

  const s = stats || {
    totalUsers: 0, totalShops: 0, pendingShops: 0,
    activePromotions: 0, expiredPromotions: 0, reportedPromotions: 0,
    totalRevenue: 0, activeSubscriptions: 0, activeCampaigns: 0,
    topCategories: [], topArrondissements: [],
    userGrowth: [], promoGrowth: [],
  }

  const cards = [
    { label: "Utilisateurs", valeur: s.totalUsers.toLocaleString(), icone: <Users className="h-5 w-5" />, couleur: "text-blue-600 bg-blue-100", lien: "/admin/utilisateurs", cardType: "card-blue" },
    { label: "Boutiques", valeur: s.totalShops.toLocaleString(), icone: <Store className="h-5 w-5" />, couleur: "text-emerald-600 bg-emerald-100", lien: "/admin/commercants", cardType: "card-secondary" },
    { label: "En attente", valeur: s.pendingShops.toString(), icone: <Clock className="h-5 w-5" />, couleur: "text-amber-600 bg-amber-100", lien: "/admin/commercants", cardType: "card-amber" },
    { label: "Promos actives", valeur: s.activePromotions.toLocaleString(), icone: <Tag className="h-5 w-5" />, couleur: "text-primary-600 bg-primary-100", lien: "/admin/promotions", cardType: "card-primary" },
    { label: "Promos expirées", valeur: s.expiredPromotions.toLocaleString(), icone: <XCircle className="h-5 w-5" />, couleur: "text-red-600 bg-red-100", lien: "/admin/promotions", cardType: "card-accent" },
    { label: "Signalements", valeur: s.reportedPromotions.toString(), icone: <AlertTriangle className="h-5 w-5" />, couleur: "text-accent-600 bg-accent-100", lien: "/admin/signalements", cardType: "card-accent" },
    { label: "Revenus", valeur: `${(s.totalRevenue || 0).toLocaleString()} FCFA`, icone: <DollarSign className="h-5 w-5" />, couleur: "text-emerald-600 bg-emerald-100", lien: "/admin/paiements", cardType: "card-secondary" },
    { label: "Abonnements", valeur: s.activeSubscriptions.toString(), icone: <Award className="h-5 w-5" />, couleur: "text-purple-600 bg-purple-100", lien: "/admin/abonnements", cardType: "card-purple" },
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
            Gérez l&apos;ensemble de la plateforme — Connecté en tant que {session.user.role === "SUPER_ADMIN" ? "Super Admin" : "Administrateur"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.lien} className={`p-5 transition-all hover:shadow-lg ${c.cardType}`}>
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.couleur}`}>{c.icone}</div>
              </div>
              <p className="mt-3 text-2xl font-bold text-dark">{c.valeur}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Top catégories</h2>
            <div className="card divide-y divide-gray-100">
              {s.topCategories.slice(0, 6).map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium text-dark">{cat.name}</span>
                  <span className="text-xs font-medium text-primary-500">{cat.count} promos</span>
                </div>
              ))}
              {s.topCategories.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">Aucune donnée</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Top arrondissements</h2>
            <div className="card divide-y divide-gray-100">
              {s.topArrondissements.slice(0, 6).map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-500" />
                    <span className="text-sm font-medium text-dark">{a.name}</span>
                  </div>
                  <span className="text-sm font-medium text-primary-500">{a.count} boutiques</span>
                </div>
              ))}
              {s.topArrondissements.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">Aucune donnée</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Croissance utilisateurs (30j)</h2>
            <div className="card p-4">
              {s.userGrowth.length > 0 ? (
                <div className="flex items-end gap-1 h-24">
                  {s.userGrowth.slice(-14).map((d, i) => {
                    const maxCount = Math.max(...s.userGrowth.map((x) => x.count), 1)
                    const height = (d.count / maxCount) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-gray-400">{d.count}</span>
                        <div className="w-full rounded-t bg-primary-500/60" style={{ height: `${height}%` }} />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center text-sm text-gray-500">Pas encore de données</div>
              )}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Croissance promotions (30j)</h2>
            <div className="card p-4">
              {s.promoGrowth.length > 0 ? (
                <div className="flex items-end gap-1 h-24">
                  {s.promoGrowth.slice(-14).map((d, i) => {
                    const maxCount = Math.max(...s.promoGrowth.map((x) => x.count), 1)
                    const height = (d.count / maxCount) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-400">{d.count}</span>
                        <div className="w-full rounded-t bg-secondary-500/60" style={{ height: `${height}%` }} />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center text-sm text-gray-500">Pas encore de données</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-dark">Accès rapides</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Gérer les utilisateurs", lien: "/admin/utilisateurs", icone: <Users className="h-5 w-5" />, couleur: "bg-blue-500" },
              { label: "Valider les boutiques", lien: "/admin/commercants", icone: <Store className="h-5 w-5" />, couleur: "bg-secondary-500" },
              { label: "Modérer les promotions", lien: "/admin/promotions", icone: <Tag className="h-5 w-5" />, couleur: "bg-primary-500" },
              { label: "Gérer les abonnements", lien: "/admin/abonnements", icone: <Award className="h-5 w-5" />, couleur: "bg-purple-500" },
            ].map((item, i) => (
              <Link key={i} href={item.lien} className="card flex items-center gap-4 p-5 transition-all hover:shadow-lg">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.couleur}`}>
                  {item.icone}
                </div>
                <div>
                  <span className="text-sm font-medium text-dark">{item.label}</span>
                  <p className="text-xs text-gray-400">Cliquez pour gérer</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {session.user.role === "SUPER_ADMIN" && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              <strong>Session Super Admin</strong> — Vous avez accès à l&apos;intégralité des fonctionnalités de la plateforme.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}