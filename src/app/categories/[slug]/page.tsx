import { notFound } from "next/navigation"
import Link from "next/link"
import { CATEGORIES } from "@/lib/utils"
import { PromotionCard } from "@/components/promotions/PromotionCard"
import { ArrowLeft, Tag } from "lucide-react"

interface PromoExemple {
  id: string
  nom: string
  slug: string
  prixNormal: number
  prixPromotionnel: number
  dateFin: string
  boutiqueNom: string
  ville: string
}

const PROMOS_PAR_CATEGORIE: Record<string, PromoExemple[]> = {}

export default function CategoriePage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug)
  if (!cat) notFound()

  const promos = PROMOS_PAR_CATEGORIE[params.slug] || []

  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-700 py-12">
        <div className="container-congo">
          <Link href="/categories" className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Toutes les catégories
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{cat.icone}</span>
            <div>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{cat.nom}</h1>
              <p className="mt-1 text-white/80">{promos.length} promotion(s) disponible(s)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-congo py-12">
        {promos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((promo) => (
              <PromotionCard key={promo.id} {...promo} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
              <Tag className="h-8 w-8 text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold text-dark">Aucune promotion pour le moment</h2>
            <p className="mt-2 text-gray-600">
              Les promotions dans cette catégorie arrivent bientôt. Revenez plus tard !
            </p>
            <Link href="/categories" className="btn-primary mt-6 inline-flex">
              Parcourir les catégories
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
