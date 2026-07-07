"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Heart, Share2, Clock, MapPin, Phone, MessageSquare,
  ArrowLeft, ChevronLeft, ChevronRight, Star, Store,
  Facebook, Twitter, Linkedin, Flag
} from "lucide-react"
import { formatPrix, calculerReduction, tempsRestant } from "@/lib/utils"
import { PromotionCard } from "@/components/promotions/PromotionCard"

export default function PromotionDetailPage({ params }: { params: { slug: string[] } }) {
  const [imageIndex, setImageIndex] = useState(0)

  const slug = params.slug?.[0]
  if (!slug) notFound()

  const images = [
    "https://placehold.co/800x600/e2e8f0/94a3b8?text=Photo+1",
    "https://placehold.co/800x600/e2e8f0/94a3b8?text=Photo+2",
    "https://placehold.co/800x600/e2e8f0/94a3b8?text=Photo+3",
  ]

  const promo = {
    nom: "Smartphone Samsung Galaxy A54 128GB",
    prixNormal: 450000,
    prixPromotionnel: 329000,
    descriptionCourte: "Smartphone Samsung Galaxy A54 5G 128GB débloqué, écran Super AMOLED 6.4\", batterie 5000mAh",
    descriptionDetaillee: `Le Samsung Galaxy A54 est le smartphone idéal pour profiter de performances exceptionnelles à un prix imbattable. 
    
Caractéristiques techniques :
• Écran Super AMOLED 6.4" Full HD+
• Processeur Exynos 1380
• 128GB de stockage extensible
• Appareil photo 50MP
• Batterie 5000mAh
• Charge rapide 25W
• Android 14
• 5G compatible

Livré avec chargeur, câble USB-C et coque de protection.`,
    dateFin: "2026-08-15",
    boutique: { nom: "Tech Store Congo", slug: "tech-store-congo", ville: "Brazzaville", quartier: "Centre-ville", note: 4.5, verifiee: true },
    categorie: "Téléphones et accessoires",
  }

  const reduction = calculerReduction(promo.prixNormal, promo.prixPromotionnel)

  return (
    <div className="container-congo py-8">
      <Link href="/promotions" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-500">
        <ArrowLeft className="h-4 w-4" /> Retour aux promotions
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-gray-100">
          <img
            src={images[imageIndex]}
            alt={promo.nom}
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
            <span className="badge-info">{promo.categorie}</span>
            <Clock className="h-3 w-3" />
            <span>{tempsRestant(promo.dateFin)}</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-dark sm:text-3xl">
            {promo.nom}
          </h1>

          <p className="mt-2 text-gray-600">{promo.descriptionCourte}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-500">
              {formatPrix(promo.prixPromotionnel)}
            </span>
            <span className="text-lg text-gray-400 line-through">
              {formatPrix(promo.prixNormal)}
            </span>
            <span className="badge-success text-sm font-bold">
              Économisez {formatPrix(promo.prixNormal - promo.prixPromotionnel)}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/242000000000?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20${encodeURIComponent(promo.nom)}`}
              target="_blank"
              className="btn-primary flex-1 bg-green-500 hover:bg-green-600"
            >
              <MessageSquare className="h-4 w-4" /> Contacter via WhatsApp
            </a>
            <a href="tel:+242000000000" className="btn-secondary flex-1">
              <Phone className="h-4 w-4" /> Appeler la boutique
            </a>
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
            <Link href={`/boutiques/${promo.boutique.slug}`} className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-xl font-bold text-primary-600">
                {promo.boutique.nom.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-dark">{promo.boutique.nom}</h3>
                  {promo.boutique.verifiee && <span className="badge-success text-[10px]">Vérifiée</span>}
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {promo.boutique.ville}, {promo.boutique.quartier}
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-dark">{promo.boutique.note}</span>
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
            {promo.descriptionDetaillee}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-dark">Partager</h2>
          <div className="mt-3 flex gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366] text-white">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2] text-white">
              <Facebook className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E4405F] text-white">
              <Instagram className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
              <Linkedin className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-dark">Promotions similaires</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <PromotionCard
              key={i}
              id={String(i)}
              nom={`Promotion similaire ${i}`}
              slug={`similaire-${i}`}
              prixNormal={100000 + i * 25000}
              prixPromotionnel={75000 + i * 15000}
              dateFin="2026-08-20"
              boutiqueNom={`Boutique ${i}`}
              ville="Brazzaville"
            />
          ))}
        </div>
      </section>
    </div>
  )
}
