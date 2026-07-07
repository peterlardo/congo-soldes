import Link from "next/link"
import { Store, MapPin, Search, Star } from "lucide-react"
import { VILLES_CONGO } from "@/lib/utils"

const BOUTIQUES = Array.from({ length: 12 }, (_, i) => ({
  nom: `Boutique ${i + 1}`,
  slug: `boutique-${i + 1}`,
  ville: VILLES_CONGO[i % VILLES_CONGO.length],
  note: (3.5 + Math.random() * 1.5).toFixed(1),
  promotions: Math.floor(Math.random() * 20) + 1,
  verifiee: Math.random() > 0.5,
}))

export default function BoutiquesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-12">
        <div className="container-congo">
          <Store className="mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Boutiques
          </h1>
          <p className="mt-2 text-white/80">
            Découvrez les commerces et boutiques partenaires
          </p>
          <div className="mt-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une boutique..."
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-12 pr-4 text-sm shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-congo py-12">
        <div className="mb-6 flex flex-wrap gap-2">
          <button className="rounded-full bg-primary-500 px-4 py-1.5 text-sm font-medium text-white">
            Toutes
          </button>
          {VILLES_CONGO.slice(0, 8).map((ville) => (
            <button
              key={ville}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-600"
            >
              {ville}
            </button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BOUTIQUES.map((boutique) => (
            <Link
              key={boutique.slug}
              href={`/boutiques/${boutique.slug}`}
              className="card p-6 transition-all hover:border-primary-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-2xl font-bold text-primary-600">
                  {boutique.nom.charAt(0)}
                </div>
                {boutique.verifiee && (
                  <span className="badge-success text-[10px]">Vérifiée</span>
                )}
              </div>
              <h3 className="mt-4 font-semibold text-dark">{boutique.nom}</h3>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                {boutique.ville}
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-dark">{boutique.note}</span>
                </div>
                <span className="text-gray-500">{boutique.promotions} promotions</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
