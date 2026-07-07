"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Save } from "lucide-react"

export default function AdminParametresPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "ADMIN") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="admin" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Paramètres de la plateforme</h1>
          <p className="mt-1 text-gray-600">Configurez les paramètres généraux</p>
        </div>

        <div className="max-w-2xl space-y-8">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Informations générales</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Nom de la plateforme</label>
                <input className="input-field" defaultValue="Congo Soldes" />
              </div>
              <div>
                <label className="label-field">Email de contact</label>
                <input className="input-field" defaultValue="contact@congosoldes.cg" />
              </div>
              <div>
                <label className="label-field">Téléphone</label>
                <input className="input-field" defaultValue="+242 05 555 55 55" />
              </div>
              <div>
                <label className="label-field">Adresse</label>
                <input className="input-field" defaultValue="Brazzaville, République du Congo" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Modération</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" defaultChecked />
                <span className="text-sm text-gray-700">Validation automatique des comptes commerçants</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" defaultChecked />
                <span className="text-sm text-gray-700">Validation manuelle des promotions</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" />
                <span className="text-sm text-gray-700">Notifications par email aux commerçants</span>
              </label>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Maintenance</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500" />
                <span className="text-sm text-gray-700">Mode maintenance</span>
              </label>
              <div>
                <label className="label-field">Message de maintenance</label>
                <textarea className="input-field" rows={3} placeholder="Site en maintenance..." />
              </div>
            </div>
          </div>

          <button className="btn-primary">
            <Save className="h-4 w-4" /> Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  )
}
