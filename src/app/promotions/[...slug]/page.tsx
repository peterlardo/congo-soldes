"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Heart, Share2, Clock, MapPin, Phone, MessageSquare,
  ArrowLeft, ChevronLeft, ChevronRight, Star, Store, Flag
} from "lucide-react"
import { formatPrix, calculerReduction, tempsRestant } from "@/lib/utils"
import { PromotionCard } from "@/components/promotions/PromotionCard"

interface PromotionData {
  id: string
  title: string
  slug: string
  description: string | null
  oldPrice: number
  newPrice: number
  discountPercentage: number
  startDate: string
  endDate: string
  status: string
  visibility: string
  shop: {
    id: string
    name: string
    slug: string
    phone: string | null
    whatsapp: string | null
    address: string | null
    logo: string | null
    isVerified: boolean
    arrondissement: { name: string }
    _count: { promotions: number; followers: number; reviews: number }
  }
  category: { name: string; slug: string }
  media: { id: string; fileUrl: string; altText: string | null; mediaType: string }[]
}

export default function PromotionDetailPage({ params }: { params: { slug: string[] } }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [promo, setPromo] = useState<PromotionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [similar, setSimilar] = useState<any[]>([])

  const slug = params.slug?.[0]
  if (!slug) notFound()

  useEffect(() => {
    fetch(`/api/promotions?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setLoading(false); return }
        setPromo(data)
        // Fetch similar promotions
        fetch(`/api/promotions?category=${data.category.slug}&limit=4`)
          .then((r) => r.json())
          .then((sim) => setSimilar(sim.promotions || []))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="container-congo py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!promo) return notFound()

  const images = promo.media.length > 0
    ? promo.media
    : [{ id: "0", fileUrl: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Photo", altText: null, mediaType: "image" }]

  const reduction = calculerReduction(promo.oldPrice, promo.newPrice)
  const shop = promo.shop

  return (
    <div className="container-congo py-8">
      <Link href="/promotions" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-500">
        <ArrowLeft className="h-4 w-4" /> Retour aux promotions
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-gray-100">
          <img
            src={images[imageIndex]?.fileUrl}
            alt={promo.title}
            className="h-full w-full object-cover"
          />
          {reduction >= 10 && (
            <div className="absolute left-4 top-4 rounded-xl bg-danger px-4 py-2 text-lg font-bold text-white shadow-lg">
              -{reduction}%
            </div>
          )}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white hover:text-red-500">
              <Heart className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white hover:text-primary-500">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImageIndex(Math.max(0, imageIndex - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow transition-colors hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setImageIndex(Math.min(images.length - 1, imageIndex + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow transition-colors hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <span className="badge-info">{promo.category.name}</span>
            <Clock className="h-3 w-3" />
            <span>{tempsRestant(promo.endDate)}</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-dark sm:text-3xl">
            {promo.title}
          </h1>

          {promo.description && (
            <p className="mt-2 text-gray-600">{promo.description}</p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-500">
              {formatPrix(promo.newPrice)}
            </span>
            <span className="text-lg text-gray-400 line-through">
              {formatPrix(promo.oldPrice)}
            </span>
            <span className="badge-success text-sm font-bold">
              Économisez {formatPrix(promo.oldPrice - promo.newPrice)}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {shop.whatsapp && (
              <a
                href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour, je suis intéressé par ${promo.title}`)}`}
                target="_blank"
                className="btn-primary flex-1 bg-green-500 hover:bg-green-600"
              >
                <MessageSquare className="h-4 w-4" /> Contacter via WhatsApp
              </a>
            )}
            {shop.phone && (
              <a href={`tel:${shop.phone}`} className="btn-secondary flex-1">
                <Phone className="h-4 w-4" /> Appeler la boutique
              </a>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button className="btn-outline flex-1">
              <Heart className="h-4 w-4" /> Ajouter aux favoris
            </button>
            <button className="btn-outline">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="btn-outline">
              <Flag className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-gray-100 p-5">
            <Link href={`/boutiques/${shop.slug}`} className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-xl font-bold text-primary-600">
                {shop.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-dark">{shop.name}</h3>
                  {shop.isVerified && <span className="badge-success text-[10px]">Vérifiée</span>}
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {shop.address || shop.arrondissement.name}
                </div>
              </div>
              <Store className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-dark">Description détaillée</h2>
          <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {promo.description}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-dark">Partager</h2>
          <div className="mt-3 flex gap-3">
            <a href={`https://wa.me/?text=${encodeURIComponent(`${promo.title} - ${formatPrix(promo.newPrice)} sur Congo Soldes`)}`} target="_blank" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366] text-white">
              <MessageSquare className="h-5 w-5" />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/promotions/${promo.slug}`)}`} target="_blank" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2] text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E4405F] text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-dark">Promotions similaires</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.slice(0, 4).map((p: any) => (
              <PromotionCard
                key={p.id}
                id={p.id}
                nom={p.title}
                slug={p.slug}
                prixNormal={p.oldPrice}
                prixPromotionnel={p.newPrice}
                dateFin={p.endDate}
                boutiqueNom={p.shop?.name || ""}
                ville={p.shop?.arrondissement?.name || ""}
                imageUrl={p.media?.[0]?.fileUrl}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}