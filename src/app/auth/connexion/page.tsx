"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !motDePasse) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    setChargement(true)
    try {
      const result = await signIn("credentials", {
        email,
        motDePasse,
        redirect: false,
      })
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Connexion réussie !")
        const res = await fetch("/api/auth/session")
        const session = await res.json()
        const role = session?.user?.role
        const dashboardMap: Record<string, string> = {
          ADMIN: "/admin/dashboard",
          COMMERCANT: "/commercant/dashboard",
          CLIENT: "/client/dashboard",
        }
        router.push(dashboardMap[role] || "/")
        router.refresh()
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary-500" />
            <span className="font-display text-xl font-bold">
              Congo <span className="text-primary-500">Soldes</span>
            </span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-dark">
            Connexion
          </h1>
          <p className="mt-1 text-gray-600">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-field" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="motDePasse">Mot de passe</label>
            <div className="relative">
              <input
                id="motDePasse"
                type={showPassword ? "text" : "password"}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="input-field pr-10"
                placeholder="Votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="btn-primary w-full"
          >
            {chargement ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Pas encore de compte ?{" "}
            <Link href="/auth/inscription-client" className="font-medium text-primary-500 hover:text-primary-600">
              Créer un compte client
            </Link>
          </p>
          <p className="mt-2">
            Vous êtes commerçant ?{" "}
            <Link href="/auth/inscription-commercant" className="font-medium text-primary-500 hover:text-primary-600">
              Créer votre boutique
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
