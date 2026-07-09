import Link from "next/link"
import { Search, SlidersHorizontal, ChevronDown, MapPin } from "lucide-react"
import { PromotionCard } from "@/components/promotions/PromotionCard"
import { CATEGORIES, VILLES_CONGO } from "@/lib/utils"

const PROMOS_EXEMPLE = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  nom: `Promotion exceptionnelle ${i + 1}`,
  slug: `promotion-${i + 1}`,
  prixNormal: 100000 + i * 25000,
  prixPromotionnel: 75000 + i * 15000,
  dateFin: "2026-08-15",
  boutiqueNom: `Boutique ${i + 1}`,
  ville: VILLES_CONGO[i % VILLES_CONGO.length],
}))

export default function PromotionsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-700 py-12">
        <div className="container-congo">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Toutes les promotions
          </h1>
          <p className="mt-2 text-white/80">
            Découvrez toutes les bonnes affaires disponibles au Congo
          </p>
          <div className="mt-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une promotion..."
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-12 pr-4 text-sm shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-congo py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="shrink-0 lg:w-72">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-dark">Catégories</h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
                    >
                      <span>{cat.icone}</span>
                      {cat.nom}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-dark">Ville</h3>
                <select className="input-field text-sm">
                  <option value="">Toutes les villes</option>
                  {VILLES_CONGO.map((ville) => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-dark">Prix</h3>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="input-field text-sm" />
                  <input type="number" placeholder="Max" className="input-field text-sm" />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-dark">Taux de réduction</h3>
                <select className="input-field text-sm">
                  <option value="">Tous</option>
                  <option value="10">-10% et plus</option>
                  <option value="25">-25% et plus</option>
                  <option value="50">-50% et plus</option>
                  <option value="70">-70% et plus</option>
                </select>
              </div>
              <button className="btn-primary w-full">Appliquer les filtres</button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-dark">{PROMOS_EXEMPLE.length}</span> promotions trouvées
              </p>
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600">
                <option>Plus récentes</option>
                <option>Plus populaires</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Plus grande réduction</option>
              </select>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {PROMOS_EXEMPLE.map((promo) => (
                <PromotionCard key={promo.id} {...promo} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
