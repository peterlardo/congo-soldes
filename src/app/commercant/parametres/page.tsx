"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Save, Bell, Mail, Smartphone } from "lucide-react"

export default function CommercantParametresPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "COMMERCANT") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Paramètres</h1>
          <p className="mt-1 text-gray-600">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="max-w-2xl space-y-8">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Informations du compte</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Nom complet</label>
                <input className="input-field" defaultValue={session.user.name || "Jean Mbemba"} />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input className="input-field" type="email" defaultValue={session.user.email || "jean.mbemba@email.cg"} />
              </div>
              <div>
                <label className="label-field">Téléphone</label>
                <input className="input-field" defaultValue="+242 06 123 45 67" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-dark">Notifications</h2>
                <p className="text-sm text-gray-500">Choisissez comment être notifié</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark">Notifications par email</p>
                      <p className="text-xs text-gray-500">Recevez un email pour chaque nouvelle réservation</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" defaultChecked />
                  </label>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark">Notifications par SMS</p>
                      <p className="text-xs text-gray-500">Recevez un SMS pour les messages urgents</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" />
                  </label>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark">Nouvelles promotions</p>
                      <p className="text-xs text-gray-500">Soyez notifié quand une promotion est approuvée</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" defaultChecked />
                  </label>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark">Rapport hebdomadaire</p>
                      <p className="text-xs text-gray-500">Recevez un résumé de vos performances chaque semaine</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" defaultChecked />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary">
            <Save className="h-4 w-4" /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
