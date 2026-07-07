"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { CATEGORIES, VILLES_CONGO } from "@/lib/utils"
import { toast } from "sonner"
import { Loader2, Upload, X, Plus } from "lucide-react"

export default function NouvellePromotionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [chargement, setChargement] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    nom: "",
    categorie: "",
    prixNormal: "",
    prixPromotionnel: "",
    descriptionCourte: "",
    descriptionDetaillee: "",
    stockDisponible: "",
    dateDebut: "",
    dateFin: "",
  })

  if (!session || session.user.role !== "COMMERCANT") {
    redirect("/auth/connexion")
  }

  const prixNormalNum = parseFloat(formData.prixNormal) || 0
  const prixPromoNum = parseFloat(formData.prixPromotionnel) || 0
  const reduction = prixNormalNum > 0
    ? Math.round(((prixNormalNum - prixPromoNum) / prixNormalNum) * 100)
    : 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.nom || !formData.prixNormal || !formData.prixPromotionnel || !formData.dateDebut || !formData.dateFin) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    setChargement(true)
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          prixNormal: prixNormalNum,
          prixPromotionnel: prixPromoNum,
          pourcentageReduction: reduction,
          stockDisponible: formData.stockDisponible ? parseInt(formData.stockDisponible) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la création")
      } else {
        toast.success("Promotion créée avec succès ! En attente de validation.")
        router.push("/commercant/promotions")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="flex min-h-[80vh]">
      <DashboardSidebar type="commercant" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-dark">Nouvelle promotion</h1>
          <p className="mt-1 text-gray-600">
            Publiez une nouvelle offre promotionnelle
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Informations générales</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Nom du produit/service *</label>
                <input name="nom" value={formData.nom} onChange={handleChange} className="input-field" placeholder="Ex: Samsung Galaxy A54 128GB" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-field">Catégorie *</label>
                  <select name="categorie" value={formData.categorie} onChange={handleChange} className="input-field" required>
                    <option value="">Sélectionner</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-field">Stock disponible</label>
                  <input name="stockDisponible" type="number" value={formData.stockDisponible} onChange={handleChange} className="input-field" placeholder="Nombre d'articles" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Prix et réduction</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">Prix normal (FCFA) *</label>
                <input name="prixNormal" type="number" value={formData.prixNormal} onChange={handleChange} className="input-field" placeholder="Ex: 450000" required />
              </div>
              <div>
                <label className="label-field">Prix promotionnel (FCFA) *</label>
                <input name="prixPromotionnel" type="number" value={formData.prixPromotionnel} onChange={handleChange} className="input-field" placeholder="Ex: 329000" required />
              </div>
            </div>
            {reduction > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                Réduction automatique : -{reduction}%
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Description</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Description courte</label>
                <textarea name="descriptionCourte" value={formData.descriptionCourte} onChange={handleChange} className="input-field" rows={2} placeholder="Brève description de l'offre..." />
              </div>
              <div>
                <label className="label-field">Description détaillée</label>
                <textarea name="descriptionDetaillee" value={formData.descriptionDetaillee} onChange={handleChange} className="input-field" rows={5} placeholder="Description complète du produit/service..." />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Photos</h2>
            <div className="flex flex-wrap gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button type="button" className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-primary-400 hover:text-primary-500">
                <Upload className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Format JPG, PNG. Max 5 photos.</p>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-dark">Durée de la promotion</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">Date de début *</label>
                <input name="dateDebut" type="date" value={formData.dateDebut} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label-field">Date de fin *</label>
                <input name="dateFin" type="date" value={formData.dateFin} onChange={handleChange} className="input-field" required />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={chargement} className="btn-primary">
              {chargement ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {chargement ? "Publication..." : "Publier la promotion"}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
