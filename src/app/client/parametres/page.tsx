"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Save, Moon, Sun, Bell, Mail, Store } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"

const villes = ["Brazzaville", "Pointe-Noire", "Dolisie", "Ouesso", "Nkayi", "Oyo", "Owando", "Impfondo", "Sibiti", "Kinkala", "Madingou", "Gamboma", "Djambala", "Mossendjo", "Makoua", "Ewo", "Sembe", "Kelle", "Boundji"]

export default function ParametresPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "CLIENT") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="client" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Paramètres</h1>
          <p className="mt-1 text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="card p-6">
          <h2 className="mb-6 text-lg font-semibold text-dark">Informations personnelles</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label-field" htmlFor="nom">Nom</label>
              <input id="nom" className="input-field" defaultValue="Moukoko" placeholder="Votre nom" />
            </div>
            <div>
              <label className="label-field" htmlFor="prenom">Prénom</label>
              <input id="prenom" className="input-field" defaultValue="Jean" placeholder="Votre prénom" />
            </div>
            <div>
              <label className="label-field" htmlFor="email">Email</label>
              <input id="email" type="email" className="input-field" defaultValue="jean.moukoko@email.cg" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="label-field" htmlFor="telephone">Téléphone</label>
              <input id="telephone" type="tel" className="input-field" defaultValue="+242 05 123 45 67" placeholder="+242 XX XXX XXX" />
            </div>
            <div>
              <label className="label-field" htmlFor="ville">Ville</label>
              <select id="ville" className="input-field" defaultValue="Brazzaville">
                {villes.map((ville) => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="mb-6 text-lg font-semibold text-dark">Préférences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">Thème</p>
                  <p className="text-xs text-gray-500">Passer en mode sombre</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <span className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-500 peer-checked:after:translate-x-full" />
              </label>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Notifications push</p>
                    <p className="text-xs text-gray-500">Recevoir les alertes en temps réel</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Notifications email</p>
                    <p className="text-xs text-gray-500">Recevoir les promotions par email</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-gray-50">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Nouvelles boutiques</p>
                    <p className="text-xs text-gray-500">Être informé des nouvelles boutiques</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600">
            <Save className="h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
