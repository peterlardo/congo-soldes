"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Bell, CheckCheck, Heart, Store, Tag, Star, Clock } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"

const notifications = [
  { id: 1, groupe: "Aujourd'hui", items: [
    { id: 11, icone: <Heart className="h-5 w-5 text-red-500" />, titre: "Nouveau favori", description: "La promotion 'Smartphone Samsung Galaxy A54' a été ajoutée à vos favoris", temps: "Il y a 2h", lu: false },
    { id: 12, icone: <Tag className="h-5 w-5 text-green-500" />, titre: "Promotion terminée", description: "L'offre 'Canapé 3 places' chez Maison Congo est maintenant terminée", temps: "Il y a 5h", lu: false },
  ]},
  { id: 2, groupe: "Cette semaine", items: [
    { id: 21, icone: <Store className="h-5 w-5 text-primary-500" />, titre: "Nouvelle boutique", description: "La boutique 'Electro Congo' a rejoint Congo Soldes", temps: "Il y a 2 jours", lu: false },
    { id: 22, icone: <Star className="h-5 w-5 text-yellow-500" />, titre: "Nouvelle promotion", description: "Découvrez -40% sur l'électroménager chez Electro Congo jusqu'au 31 juillet", temps: "Il y a 3 jours", lu: true },
    { id: 23, icone: <Bell className="h-5 w-5 text-blue-500" />, titre: "Rappel", description: "Votre promotion 'Chaussures de sport' se termine dans 2 jours", temps: "Il y a 5 jours", lu: true },
  ]},
  { id: 3, groupe: "Plus anciennes", items: [
    { id: 31, icone: <Heart className="h-5 w-5 text-red-500" />, titre: "Favoris sauvegardés", description: "3 promotions de vos boutiques suivies sont en promotion cette semaine", temps: "Il y a 8 jours", lu: true },
    { id: 32, icone: <Store className="h-5 w-5 text-primary-500" />, titre: "Boutique suivie", description: "Vous suivez maintenant 'Mode Africa' - recevez leurs prochaines offres", temps: "Il y a 12 jours", lu: true },
  ]},
]

export default function NotificationsPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "CLIENT") redirect("/auth/connexion")

  const nonLues = notifications.flatMap(g => g.items).filter(n => !n.lu).length

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="client" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">Notifications</h1>
            <p className="mt-1 text-gray-600">Restez informé des dernières actualités</p>
          </div>
          {nonLues > 0 && (
            <button className="flex items-center gap-2 rounded-lg border border-primary-500 px-4 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50">
              <CheckCheck className="h-4 w-4" />
              Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="space-y-8">
          {notifications.map((groupe) => (
            <div key={groupe.id}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">{groupe.groupe}</h2>
              <div className="space-y-3">
                {groupe.items.map((notif) => (
                  <div key={notif.id} className={`card flex items-start gap-4 p-4 ${!notif.lu ? "border-l-4 border-l-primary-500" : ""}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                      {notif.icone}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${!notif.lu ? "font-semibold text-dark" : "font-medium text-dark"}`}>{notif.titre}</p>
                        {!notif.lu && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">{notif.description}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" /> {notif.temps}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
