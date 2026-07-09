"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Tag, Eye, MessageSquare, Heart, Phone, TrendingUp,
  Plus, Clock, CheckCircle, XCircle, AlertCircle
} from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { cn } from "@/lib/utils"

export default function CommercantDashboard() {
  const { data: session } = useSession()

  if (!session) {
    redirect("/auth/connexion")
  }

  if (session.user.role !== "MERCHANT" && session.user.role !== "COMMERCANT") {
    redirect("/")
  }

  const stats = [
    { label: "Promotions actives", valeur: "8", icone: <CheckCircle className="h-5 w-5" />, couleur: "text-secondary-600 bg-secondary-100", cardType: "card-secondary" },
    { label: "En attente", valeur: "2", icone: <Clock className="h-5 w-5" />, couleur: "text-amber-600 bg-amber-100", cardType: "card-amber" },
    { label: "Expirées", valeur: "3", icone: <XCircle className="h-5 w-5" />, couleur: "text-accent-600 bg-accent-100", cardType: "card-accent" },
    { label: "Vues totales", valeur: "1,247", icone: <Eye className="h-5 w-5" />, couleur: "text-blue-600 bg-blue-100", cardType: "card-blue" },
    { label: "Clics WhatsApp", valeur: "89", icone: <MessageSquare className="h-5 w-5" />, couleur: "text-secondary-600 bg-secondary-100", cardType: "card-secondary" },
    { label: "Appels", valeur: "34", icone: <Phone className="h-5 w-5" />, couleur: "text-primary-600 bg-primary-100", cardType: "card-primary" },
    { label: "Favoris", valeur: "156", icone: <Heart className="h-5 w-5" />, couleur: "text-accent-600 bg-accent-100", cardType: "card-accent" },
    { label: "Messages", valeur: "12", icone: <MessageSquare className="h-5 w-5" />, couleur: "text-purple-600 bg-purple-100", cardType: "card-purple" },
  ]

  const abonnement = {
    type: "Standard",
    fin: "2026-08-15",
    maxPromos: 20,
    utilise: 10,
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">
              Bonjour, {session.user.name || "Commerçant"}
            </h1>
            <p className="mt-1 text-gray-600">
              Gérez vos promotions et votre boutique
            </p>
          </div>
          <Link href="/commercant/promotions/nouvelle" className="btn-primary">
            <Plus className="h-4 w-4" />
            Nouvelle promotion
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-primary-100 bg-primary-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary-700">
                Abonnement <span className="font-bold">{abonnement.type}</span>
              </p>
              <p className="text-xs text-primary-600">
                {abonnement.utilise}/{abonnement.maxPromos} promotions utilisées
                • Expire le {abonnement.fin}
              </p>
            </div>
            <Link href="/commercant/abonnement" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Gérer mon abonnement →
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-5 transition-all hover:shadow-lg ${stat.cardType}`}>
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.couleur}`}>
                  {stat.icone}
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-dark">{stat.valeur}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Promotions récentes</h2>
            <div className="space-y-3">
              {[
                { nom: "Smartphone Samsung A54", statut: "ACTIF", vues: 234, date: "2026-07-15" },
                { nom: "Pack Alimentaire Familial", statut: "ACTIF", vues: 189, date: "2026-07-14" },
                { nom: "Canapé Cuir 3 places", statut: "EN_ATTENTE", vues: 0, date: "2026-07-13" },
                { nom: "Parfum Iconique", statut: "EXPIRE", vues: 567, date: "2026-07-01" },
              ].map((promo, i) => (
                <div key={i} className="card flex items-center justify-between p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">{promo.nom}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span>{promo.date}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {promo.vues}
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    "badge",
                    promo.statut === "ACTIF" && "badge-success",
                    promo.statut === "EN_ATTENTE" && "badge-warning",
                    promo.statut === "EXPIRE" && "badge-danger",
                  )}>
                    {promo.statut === "ACTIF" ? "Actif" : promo.statut === "EN_ATTENTE" ? "En attente" : "Expiré"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">Aperçu des statistiques</h2>
            <div className="card p-6">
              <div className="space-y-4">
                {[
                  { label: "Vues aujourd'hui", valeur: 45, total: 1247, pourcentage: 72 },
                  { label: "Clics WhatsApp", valeur: 12, total: 89, pourcentage: 45 },
                  { label: "Appels reçus", valeur: 3, total: 34, pourcentage: 28 },
                  { label: "Favoris ajoutés", valeur: 8, total: 156, pourcentage: 65 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium text-dark">{item.valeur}/{item.total}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-primary-500 transition-all"
                        style={{ width: `${item.pourcentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/commercant/statistiques" className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600">
                Voir les statistiques détaillées <TrendingUp className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
