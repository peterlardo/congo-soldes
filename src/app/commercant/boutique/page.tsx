"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Save, Store, MapPin, Phone, Globe, Camera } from "lucide-react"

const CATEGORIES_DISPONIBLES = [
  "Mode et vêtements", "Chaussures", "Téléphones et accessoires",
  "Informatique", "Électroménager", "Beauté et cosmétique",
  "Alimentation", "Restaurants et fast-food", "Meubles et décoration",
  "Supermarchés", "Automobile", "Services",
]

export default function CommercantBoutiquePage() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    nom: "Tech Store Congo",
    description: "Votre référence en électronique et high-tech à Brazzaville. Nous proposons les meilleures marques aux meilleurs prix.",
    adresse: "Avenue Charles de Gaulle, Centre-ville",
    ville: "Brazzaville",
    telephone: "+242 06 123 45 67",
    logoUrl: "",
    siteWeb: "https://techstorecongo.cg",
    categories: ["Téléphones et accessoires", "Informatique", "Électroménager"],
  })

  if (!session || session.user.role !== "COMMERCANT") redirect("/auth/connexion")

  function toggleCategorie(cat: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Ma boutique</h1>
          <p className="mt-1 text-gray-600">Gérez les informations de votre boutique</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            <div className="card p-6">
              <h2 className="mb-4 font-semibold text-dark">Informations générales</h2>
              <div className="space-y-4">
                <div>
                  <label className="label-field">Nom de la boutique *</label>
                  <input name="nom" value={form.nom} onChange={handleChange} className="input-field" placeholder="Nom de votre boutique" />
                </div>
                <div>
                  <label className="label-field">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} placeholder="Présentez votre boutique..." />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-field">Adresse</label>
                    <input name="adresse" value={form.adresse} onChange={handleChange} className="input-field" placeholder="Adresse physique" />
                  </div>
                  <div>
                    <label className="label-field">Ville *</label>
                    <select name="ville" value={form.ville} onChange={handleChange} className="input-field">
                      <option value="Brazzaville">Brazzaville</option>
                      <option value="Pointe-Noire">Pointe-Noire</option>
                      <option value="Dolisie">Dolisie</option>
                      <option value="Ouesso">Ouesso</option>
                      <option value="Nkayi">Nkayi</option>
                      <option value="Oyo">Oyo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="mb-4 font-semibold text-dark">Contact</h2>
              <div className="space-y-4">
                <div>
                  <label className="label-field">Téléphone *</label>
                  <input name="telephone" value={form.telephone} onChange={handleChange} className="input-field" placeholder="+242 XX XXX XX XX" />
                </div>
                <div>
                  <label className="label-field">Site web</label>
                  <input name="siteWeb" value={form.siteWeb} onChange={handleChange} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="label-field">URL du logo</label>
                  <input name="logoUrl" value={form.logoUrl} onChange={handleChange} className="input-field" placeholder="Lien vers votre logo" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="mb-4 font-semibold text-dark">Catégories</h2>
              <p className="mb-3 text-sm text-gray-500">Sélectionnez les catégories de votre boutique</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES_DISPONIBLES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategorie(cat)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      form.categories.includes(cat)
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary">
              <Save className="h-4 w-4" /> Enregistrer
            </button>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="card p-6 sticky top-24">
              <h3 className="mb-4 text-sm font-semibold text-dark">Aperçu</h3>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8" />
                  )}
                </div>
                <h4 className="mt-3 font-semibold text-dark">{form.nom || "Nom de la boutique"}</h4>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{form.description}</p>
                <div className="mt-4 w-full space-y-2 text-left text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                    <span>{form.adresse}, {form.ville}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                    <span>{form.telephone}</span>
                  </div>
                  {form.siteWeb && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                      <span className="truncate">{form.siteWeb}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {form.categories.map((cat) => (
                    <span key={cat} className="badge badge-primary text-xs">{cat}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary-50 p-3 text-xs text-primary-700">
                <Store className="h-4 w-4" />
                Boutique visible sur le site
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
