"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Store, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { VILLES_CONGO } from "@/lib/utils"

export default function InscriptionCommercantPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    confirmMotDePasse: "",
    boutiqueNom: "",
    boutiqueDescription: "",
    ville: "",
    quartier: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [chargement, setChargement] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    if (!formData.boutiqueNom) {
      toast.error("Veuillez donner un nom à votre boutique")
      return
    }
    setChargement(true)
    try {
      const res = await fetch("/api/auth/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "COMMERCANT" }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'inscription")
      } else {
        toast.success("Votre boutique a été créée ! Connectez-vous.")
        router.push("/auth/connexion")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <Store className="h-8 w-8 text-primary-500" />
            <span className="font-display text-xl font-bold">
              Congo <span className="text-primary-500">Soldes</span>
            </span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-dark">
            Créer votre boutique
          </h1>
          <p className="mt-1 text-gray-600">
            Rejoignez la première plateforme de promotions au Congo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-primary-700">Informations de la boutique</h3>
            <div className="space-y-4">
              <div>
                <label className="label-field" htmlFor="boutiqueNom">Nom de la boutique *</label>
                <input id="boutiqueNom" name="boutiqueNom" value={formData.boutiqueNom} onChange={handleChange} className="input-field" placeholder="Nom de votre commerce" required />
              </div>
              <div>
                <label className="label-field" htmlFor="boutiqueDescription">Description</label>
                <textarea id="boutiqueDescription" name="boutiqueDescription" value={formData.boutiqueDescription} onChange={handleChange} className="input-field" rows={3} placeholder="Présentez votre boutique..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field" htmlFor="ville">Ville *</label>
                  <select id="ville" name="ville" value={formData.ville} onChange={handleChange} className="input-field" required>
                    <option value="">Sélectionner</option>
                    {VILLES_CONGO.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field" htmlFor="quartier">Quartier</label>
                  <input id="quartier" name="quartier" value={formData.quartier} onChange={handleChange} className="input-field" placeholder="Quartier" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Vos informations</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field" htmlFor="prenom">Prénom</label>
                <input id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} className="input-field" placeholder="Votre prénom" />
              </div>
              <div>
                <label className="label-field" htmlFor="nom">Nom *</label>
                <input id="nom" name="nom" value={formData.nom} onChange={handleChange} className="input-field" placeholder="Votre nom" required />
              </div>
            </div>
            <div className="mt-4">
              <label className="label-field" htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="votre@email.com" required />
            </div>
            <div className="mt-4">
              <label className="label-field" htmlFor="telephone">Téléphone *</label>
              <input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} className="input-field" placeholder="+242 XX XXX XXX" required />
            </div>
          </div>

          <div>
            <label className="label-field" htmlFor="motDePasse">Mot de passe *</label>
            <div className="relative">
              <input id="motDePasse" name="motDePasse" type={showPassword ? "text" : "password"} value={formData.motDePasse} onChange={handleChange} className="input-field pr-10" placeholder="Minimum 8 caractères" required minLength={8} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label-field" htmlFor="confirmMotDePasse">Confirmer le mot de passe *</label>
            <input id="confirmMotDePasse" name="confirmMotDePasse" type="password" value={formData.confirmMotDePasse} onChange={handleChange} className="input-field" placeholder="Confirmez votre mot de passe" required />
          </div>

          <p className="text-xs text-gray-500">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/conditions" className="text-primary-500 hover:underline">conditions générales</Link>{" "}
            et notre{" "}
            <Link href="/confidentialite" className="text-primary-500 hover:underline">politique de confidentialité</Link>.
          </p>

          <button type="submit" disabled={chargement} className="btn-primary w-full">
            {chargement ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {chargement ? "Création en cours..." : "Créer ma boutique"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà inscrit ?{" "}
          <Link href="/auth/connexion" className="font-medium text-primary-500 hover:text-primary-600">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
