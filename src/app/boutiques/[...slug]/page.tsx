import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin, Phone, MessageSquare, Globe, Clock, Star,
  Store, Share2, Heart, Facebook, Instagram, Twitter
} from "lucide-react"
import { PromotionCard } from "@/components/promotions/PromotionCard"

export default function BoutiqueDetailPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug?.[0]
  if (!slug) notFound()

  const boutique = {
    nom: "Tech Store Congo",
    slug: "tech-store-congo",
    description: "Votre magasin de référence pour tout l'univers de la technologie au Congo. Smartphones, ordinateurs, accessoires et bien plus aux meilleurs prix.",
    ville: "Brazzaville",
    quartier: "Centre-ville",
    adresse: "Avenue de la République, Brazzaville",
    telephone: "+242 05 000 00 00",
    whatsapp: "+242 05 000 00 00",
    email: "contact@techstore.cg",
    siteWeb: "https://techstore.cg",
    horaires: "Lun-Sam: 08h00-19h00",
    facebook: "#",
    instagram: "#",
    note: 4.5,
    nombreAvis: 28,
    verifiee: true,
    promotions: 12,
  }

  return (
    <div className="container-congo py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-3xl font-bold text-primary-600">
              {boutique.nom.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-dark">{boutique.nom}</h1>
                {boutique.verifiee && <span className="badge-success">Vérifiée</span>}
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {boutique.ville}, {boutique.quartier}
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-dark">{boutique.note}</span>
                  <span className="text-gray-500">({boutique.nombreAvis} avis)</span>
                </div>
                <span className="text-sm text-gray-500">{boutique.promotions} promotions</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="leading-relaxed text-gray-600">{boutique.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${boutique.telephone}`} className="btn-primary">
              <Phone className="h-4 w-4" /> Appeler
            </a>
            <a href={`https://wa.me/${boutique.whatsapp}`} target="_blank" className="btn-secondary bg-green-500 text-white border-green-500 hover:bg-green-600">
              <MessageSquare className="h-4 w-4" /> WhatsApp
            </a>
            <button className="btn-outline">
              <Heart className="h-4 w-4" /> Suivre
            </button>
            <button className="btn-outline">
              <Share2 className="h-4 w-4" /> Partager
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-dark">Promotions de la boutique</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <PromotionCard
                  key={i}
                  id={String(i)}
                  nom={`Promotion ${i} - ${boutique.nom}`}
                  slug={`promo-boutique-${i}`}
                  prixNormal={85000 + i * 15000}
                  prixPromotionnel={55000 + i * 10000}
                  dateFin="2026-08-15"
                  boutiqueNom={boutique.nom}
                  ville={boutique.ville}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-20 space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-dark">Informations</h3>
              <div className="mt-4 space-y-4">
                {[
                  { icone: <MapPin className="h-4 w-4" />, label: "Adresse", valeur: boutique.adresse },
                  { icone: <Phone className="h-4 w-4" />, label: "Téléphone", valeur: boutique.telephone },
                  { icone: <MessageSquare className="h-4 w-4" />, label: "WhatsApp", valeur: boutique.whatsapp },
                  { icone: <Globe className="h-4 w-4" />, label: "Site web", valeur: boutique.siteWeb },
                  { icone: <Clock className="h-4 w-4" />, label: "Horaires", valeur: boutique.horaires },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 text-primary-500">{item.icone}</span>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-dark">{item.valeur}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-dark">Réseaux sociaux</h3>
              <div className="mt-3 flex gap-2">
                <a href={boutique.facebook} className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href={boutique.instagram} className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
