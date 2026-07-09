"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  Menu, X, Search, ShoppingBag, Store, User, LogOut,
  ChevronDown, Heart, LayoutDashboard, Settings, MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [rechercheOuverte, setRechercheOuverte] = useState(false)
  const [profilOuvert, setProfilOuvert] = useState(false)
  const { data: session } = useSession()

  const estConnecte = !!session?.user
  const role = session?.user?.role

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="container-congo">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary-500" />
            <span className="font-display text-xl font-bold text-dark">
              Congo <span className="text-primary-500">Soldes</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/promotions" className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-500">
              Promotions
            </Link>
            <Link href="/categories" className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-500">
              Catégories
            </Link>
            <Link href="/boutiques" className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-500">
              Boutiques
            </Link>
            <Link href="/tarifs" className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-500">
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRechercheOuverte(!rechercheOuverte)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-500"
            >
              <Search className="h-5 w-5" />
            </button>

            {estConnecte ? (
              <div className="relative">
                <button
                  onClick={() => setProfilOuvert(!profilOuvert)}
                  className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {profilOuvert && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfilOuvert(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                      <div className="border-b border-gray-100 px-3 py-2">
                        <p className="text-sm font-medium text-dark">{session.user.name}</p>
                        <p className="text-xs text-gray-500">{session.user.email}</p>
                      </div>
                      <div className="mt-1 space-y-1">
                        {role === "CLIENT" && (
                          <>
                            <Link href="/client/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfilOuvert(false)}>
                              <LayoutDashboard className="h-4 w-4" /> Tableau de bord
                            </Link>
                            <Link href="/client/favoris" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfilOuvert(false)}>
                              <Heart className="h-4 w-4" /> Mes favoris
                            </Link>
                          </>
                        )}
                        {(role === "MERCHANT" || role === "COMMERCANT") && (
                          <>
                            <Link href="/commercant/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfilOuvert(false)}>
                              <Store className="h-4 w-4" /> Espace commerçant
                            </Link>
                            <Link href="/commercant/messages" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfilOuvert(false)}>
                              <MessageSquare className="h-4 w-4" /> Messages
                            </Link>
                          </>
                        )}
                        {(role === "ADMIN" || role === "SUPER_ADMIN" || role === "MODERATOR") && (
                          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfilOuvert(false)}>
                            <Settings className="h-4 w-4" /> Administration
                          </Link>
                        )}
                        <Link href="/client/parametres" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfilOuvert(false)}>
                          <Settings className="h-4 w-4" /> Paramètres
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => signOut()}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" /> Déconnexion
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/auth/connexion" className="btn-outline text-sm">
                  Connexion
                </Link>
                <Link href="/auth/inscription-commercant" className="btn-primary text-sm">
                  Vendre sur Congo Soldes
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            >
              {menuOuvert ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {rechercheOuverte && (
          <div className="animate-slide-down border-t border-gray-100 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une promotion, une boutique, une catégorie..."
                className="input-field pl-12"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {menuOuvert && (
        <div className="animate-slide-down border-t border-gray-100 bg-white md:hidden">
          <div className="container-congo space-y-1 py-4">
            <Link href="/promotions" className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
              Promotions
            </Link>
            <Link href="/categories" className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
              Catégories
            </Link>
            <Link href="/boutiques" className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
              Boutiques
            </Link>
            <Link href="/tarifs" className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
              Tarifs et abonnements
            </Link>
            <hr className="my-2" />
            {!estConnecte && (
              <>
                <Link href="/auth/connexion" className="block rounded-lg px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50" onClick={() => setMenuOuvert(false)}>
                  Connexion
                </Link>
                <Link href="/auth/inscription-client" className="block rounded-lg px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50" onClick={() => setMenuOuvert(false)}>
                  Créer un compte
                </Link>
              </>
            )}
            <Link href="/a-propos" className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
              À propos
            </Link>
            <Link href="/contact" className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
