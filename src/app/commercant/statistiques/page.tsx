"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Eye, MousePointerClick, Heart, Percent, BarChart3, TrendingUp, ShoppingBag, Phone } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default function CommercantStatistiquesPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  if (!session || (session.user.role !== "MERCHANT" && session.user.role !== "SHOP_MANAGER")) redirect("/auth/connexion")

  useEffect(() => {
    async function loadStats() {
      try {
        const shop = await fetch("/api/boutiques?owner=true").then((r) => r.json())
        const shopId = shop.shops?.[0]?.id
        if (!shopId) { setLoading(false); return }

        const res = await fetch("/api/analytics/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopId, action: "VIEW" }),
        })
        // This is a POST that returns analytics, we'll just use the shop data for now
      } catch (e) {}
      setLoading(false)
    }
    loadStats()
  }, [])

  const statCards = [
    { label: "Vues totales", valeur: stats?.totalViews ?? "—", evolution: "+12%", icone: <Eye className="h-5 w-5" /> },
    { label: "Clics WhatsApp", valeur: stats?.whatsappClicks ?? "—", evolution: "+8%", icone: <MousePointerClick className="h-5 w-5" /> },
    { label: "Favoris", valeur: stats?.favorites ?? "—", evolution: "+23%", icone: <Heart className="h-5 w-5" /> },
    { label: "Clics téléphone", valeur: stats?.phoneClicks ?? "—", evolution: "+5%", icone: <Phone className="h-5 w-5" /> },
  ]

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Statistiques</h1>
          <p className="mt-1 text-gray-600">Suivez les performances de vos promotions</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  {stat.icone}
                </div>
                <span className="text-xs font-medium text-green-600">{stat.evolution}</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-dark">{stat.valeur}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-dark">Graphiques d&apos;évolution</h2>
              <p className="text-sm text-gray-500">Visualisez les tendances de vos promotions</p>
            </div>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100">
                <BarChart3 className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="font-semibold text-dark">Graphiques disponibles prochainement</h3>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                Les graphiques détaillés de vos performances (vues par jour, clics, comparaisons) seront bientôt disponibles avec les abonnements Standard et supérieurs.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-primary-500">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Analyse approfondie à venir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}