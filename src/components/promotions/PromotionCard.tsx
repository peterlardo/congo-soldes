"use client"

import Link from "next/link"
import { Heart, Share2, Clock, Eye, MapPin } from "lucide-react"
import { formatPrix, calculerReduction, tempsRestant, cn } from "@/lib/utils"

interface PromotionCardProps {
  id: string
  nom: string
  slug: string
  prixNormal: number
  prixPromotionnel: number
  imageUrl?: string
  boutiqueNom: string
  boutiqueSlug?: string
  ville?: string
  dateFin: Date | string
  visibilite?: string
}

export function PromotionCard({
  id,
  nom,
  slug,
  prixNormal,
  prixPromotionnel,
  imageUrl,
  boutiqueNom,
  boutiqueSlug,
  ville,
  dateFin,
  visibilite,
}: PromotionCardProps) {
  const reduction = calculerReduction(prixNormal, prixPromotionnel)
  const reste = tempsRestant(dateFin)

  return (
    <Link href={`/promotions/${slug}`} className="card group">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nom}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {reduction >= 10 && (
          <div className="absolute left-2 top-2 rounded-lg bg-danger px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            -{reduction}%
          </div>
        )}

        {visibilite === "SPONSORISE" && (
          <div className="absolute right-2 top-2 rounded-full bg-secondary-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            Sponsorisé
          </div>
        )}

        {visibilite === "PREMIUM" && (
          <div className="absolute right-2 top-2 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            Premium
          </div>
        )}

        <div className="absolute bottom-2 right-2 flex gap-1">
          <button
            onClick={(e) => {
              e.preventDefault()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-white hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-white hover:text-primary-500"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{reste}</span>
        </div>

        <h3 className="mb-2 text-sm font-semibold leading-tight text-dark transition-colors group-hover:text-primary-500 line-clamp-2">
          {nom}
        </h3>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary-500">
            {formatPrix(prixPromotionnel)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatPrix(prixNormal)}
          </span>
        </div>

        <div className="space-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-700">{boutiqueNom}</span>
          </div>
          {ville && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{ville}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
