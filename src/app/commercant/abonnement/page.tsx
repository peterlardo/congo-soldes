"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Check, X, CreditCard } from "lucide-react"
import { getAbonnementLabel } from "@/lib/utils"

const FORMULES = [
  { type: "GRATUIT", prix: 0, maxPromos: 5, maxPhotos: 3, sponsorise: false, statsAvancees: false },
  { type: "STANDARD", prix: 15000, maxPromos: 20, maxPhotos: 10, sponsorise: false, statsAvancees: true },
  { type: "PREMIUM", prix: 35000, maxPromos: 50, maxPhotos: 20, sponsorise: true, statsAvancees: true },
  { type: "ENTREPRISE", prix: 75000, maxPromos: -1, maxPhotos: -1, sponsorise: true, statsAvancees: true },
]

export default function CommercantAbonnementPage() {
  const { data: session } = useSession()
  if (!session || session.user.role !== "COMMERCANT") redirect("/auth/connexion")

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Abonnement</h1>
          <p className="mt-1 text-gray-600">Gérez votre formule d&apos;abonnement</p>
        </div>

        <div className="mb-8 rounded-lg border border-primary-100 bg-primary-50 p-6">
          <CreditCard className="mb-2 h-6 w-6 text-primary-500" />
          <h2 className="font-semibold text-primary-700">Abonnement actuel : Standard</h2>
          <p className="mt-1 text-sm text-primary-600">Expire le 15 août 2026</p>
          <div className="mt-3 flex gap-3">
            <button className="btn-primary text-sm">Renouveler</button>
            <button className="btn-secondary text-sm">Changer de formule</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {FORMULES.map((f) => (
            <div key={f.type} className={`card p-5 ${f.type === "STANDARD" ? "border-primary-500 ring-2 ring-primary-500" : ""}`}>
              <h3 className="font-semibold text-dark">{getAbonnementLabel(f.type)}</h3>
              <p className="mt-2 text-2xl font-bold text-dark">
                {f.prix === 0 ? "Gratuit" : `${f.prix.toLocaleString()} FCFA`}
                {f.prix > 0 && <span className="text-sm font-normal text-gray-500">/mois</span>}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  {f.maxPromos === -1 ? <Check className="h-4 w-4 text-green-500" /> : <Check className="h-4 w-4 text-green-500" />}
                  <span>{f.maxPromos === -1 ? "Promos illimitées" : `${f.maxPromos} promos max`}</span>
                </li>
                <li className="flex items-center gap-2">
                  {f.maxPhotos === -1 ? <Check className="h-4 w-4 text-green-500" /> : <Check className="h-4 w-4 text-green-500" />}
                  <span>{f.maxPhotos === -1 ? "Photos illimitées" : `${f.maxPhotos} photos max`}</span>
                </li>
                <li className="flex items-center gap-2">
                  {f.sponsorise ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className={f.sponsorise ? "" : "text-gray-400"}>Sponsorisation</span>
                </li>
                <li className="flex items-center gap-2">
                  {f.statsAvancees ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className={f.statsAvancees ? "" : "text-gray-400"}>Statistiques avancées</span>
                </li>
              </ul>
              <button className={`mt-4 w-full rounded-lg py-2 text-sm font-semibold transition-all ${
                f.type === "STANDARD"
                  ? "bg-primary-500 text-white hover:bg-primary-600"
                  : "border-2 border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-500"
              }`}>
                {f.type === "STANDARD" ? "Formule actuelle" : "Choisir"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
