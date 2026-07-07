"use client"

import Link from "next/link"
import {
  Search, MapPin, ShoppingBag, Store, Tag, TrendingUp,
  Shield, Smartphone, Percent, Zap, Star, ArrowRight,
  ChevronRight, Heart, Share2, Clock
} from "lucide-react"
import { PromotionCard } from "@/components/promotions/PromotionCard"
import { CategoryCard } from "@/components/categories/CategoryCard"
import { CATEGORIES } from "@/lib/utils"

const PROMOS_EXEMPLE = [
  {
    id: "1", nom: "Smartphone Samsung Galaxy A54 128GB", slug: "samsung-galaxy-a54",
    prixNormal: 450000, prixPromotionnel: 329000, dateFin: "2026-08-15",
    boutiqueNom: "Tech Store Congo", ville: "Brazzaville",
  },
  {
    id: "2", nom: "Pack Familial - 10kg Riz + 5L Huile + 2kg Sucre", slug: "pack-familial",
    prixNormal: 35000, prixPromotionnel: 25500, dateFin: "2026-07-30",
    boutiqueNom: "Super Marché Express", ville: "Pointe-Noire",
  },
  {
    id: "3", nom: "Canapé 3 places cuir véritable", slug: "canape-cuir-3-places",
    prixNormal: 850000, prixPromotionnel: 599000, dateFin: "2026-08-20",
    boutiqueNom: "Maison & Déco", ville: "Brazzaville",
    visibilite: "SPONSORISE",
  },
  {
    id: "4", nom: "Parfum Iconique 100ml - 50% de réduction", slug: "parfum-iconique",
    prixNormal: 120000, prixPromotionnel: 60000, dateFin: "2026-07-25",
    boutiqueNom: "Beauty Palace", ville: "Pointe-Noire",
    visibilite: "PREMIUM",
  },
  {
    id: "5", nom: "Menu Big Burger + Frites + Boisson", slug: "menu-big-burger",
    prixNormal: 8500, prixPromotionnel: 5500, dateFin: "2026-08-01",
    boutiqueNom: "Fast Food King", ville: "Brazzaville",
  },
  {
    id: "6", nom: "Climatiseur 12000 BTU Inverter", slug: "climatiseur-12000-btu",
    prixNormal: 650000, prixPromotionnel: 449000, dateFin: "2026-08-10",
    boutiqueNom: "Electro Shop", ville: "Dolisie",
  },
]

const BOUTIQUES_EXEMPLE = [
  { nom: "Tech Store Congo", slug: "tech-store-congo", ville: "Brazzaville" },
  { nom: "Super Marché Express", slug: "super-marche-express", ville: "Pointe-Noire" },
  { nom: "Maison & Déco", slug: "maison-deco", ville: "Brazzaville" },
  { nom: "Beauty Palace", slug: "beauty-palace", ville: "Pointe-Noire" },
]

export default function Accueil() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-congo relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-yellow-300" />
              Les meilleures promotions du Congo
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              La qualité <span className="text-yellow-300">au petit prix</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Trouvez les meilleures promotions, réductions et soldes près de chez vous.
              Des milliers d&apos;offres dans toutes les catégories.
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Que cherchez-vous ? (produit, boutique, catégorie...)"
                  className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-base text-dark shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 max-sm:hidden">
                  Rechercher
                </button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["Mode", "Électroménager", "Téléphones", "Alimentation", "Meubles"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/categories/${tag.toLowerCase()}`}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/80 backdrop-blur-sm transition-colors hover:bg-white/25"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-congo py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="section-title">Catégories</h2>
            <p className="section-subtitle">Parcourez les promotions par catégorie</p>
          </div>
          <Link
            href="/categories"
            className="hidden items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 sm:flex"
          >
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <CategoryCard key={cat.slug} {...cat} />
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/categories" className="btn-outline">
            Voir toutes les catégories
          </Link>
        </div>
      </section>

      {/* Meilleures Promotions */}
      <section className="bg-gray-50 py-16">
        <div className="container-congo">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="section-title">Meilleures promotions</h2>
              <p className="section-subtitle">Les offres les plus populaires du moment</p>
            </div>
            <Link
              href="/promotions"
              className="hidden items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 sm:flex"
            >
              Voir tout <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PROMOS_EXEMPLE.map((promo) => (
              <PromotionCard key={promo.id} {...promo} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/promotions" className="btn-primary">
              Voir toutes les promotions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions sponsorisées / Premium */}
      <section className="container-congo py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="section-title">Promotions en vedette</h2>
            <p className="section-subtitle">Les offres sponsorisées et premium</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROMOS_EXEMPLE.filter((p) => p.visibilite).map((promo) => (
            <PromotionCard key={promo.id} {...promo} />
          ))}
        </div>
      </section>

      {/* Top réductions */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 py-16">
        <div className="container-congo">
          <div className="mb-8 text-center text-white">
            <Percent className="mx-auto mb-4 h-10 w-10 text-yellow-300" />
            <h2 className="font-display text-3xl font-bold">Top réductions</h2>
            <p className="mt-2 text-white/80">Les meilleurs pourcentages de réduction du moment</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROMOS_EXEMPLE.slice(0, 3).map((promo) => (
              <PromotionCard key={promo.id} {...promo} />
            ))}
          </div>
        </div>
      </section>

      {/* Boutiques populaires */}
      <section className="container-congo py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="section-title">Boutiques populaires</h2>
            <p className="section-subtitle">Les commerces les plus suivis</p>
          </div>
          <Link
            href="/boutiques"
            className="hidden items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 sm:flex"
          >
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BOUTIQUES_EXEMPLE.map((boutique) => (
            <Link
              key={boutique.slug}
              href={`/boutiques/${boutique.slug}`}
              className="card flex items-center gap-4 p-5 transition-all hover:border-primary-200"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                {boutique.nom.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-dark">{boutique.nom}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {boutique.ville}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-primary-500">
                  <Store className="h-3 w-3" />
                  Voir la boutique
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pourquoi Congo Soldes */}
      <section className="bg-gray-50 py-16">
        <div className="container-congo">
          <div className="mb-12 text-center">
            <h2 className="section-title">Pourquoi utiliser Congo Soldes ?</h2>
            <p className="section-subtitle mx-auto max-w-2xl">
              La plateforme congolaise qui connecte les commerçants et les consommateurs
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icone: <Tag className="h-6 w-6" />,
                titre: "Meilleurs prix",
                desc: "Comparez les offres et trouvez les meilleures promotions près de chez vous.",
              },
              {
                icone: <MapPin className="h-6 w-6" />,
                titre: "Proche de vous",
                desc: "Géolocalisez les boutiques et trouvez les bonnes affaires dans votre quartier.",
              },
              {
                icone: <Smartphone className="h-6 w-6" />,
                titre: "Simple et rapide",
                desc: "Une interface intuitive accessible depuis votre téléphone ou votre ordinateur.",
              },
              {
                icone: <Shield className="h-6 w-6" />,
                titre: "Boutiques vérifiées",
                desc: "Tous les commerces sont vérifiés pour garantir des offres fiables.",
              },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
                  {item.icone}
                </div>
                <h3 className="mb-2 font-semibold text-dark">{item.titre}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Devenir commerçant */}
      <section className="container-congo py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 sm:p-12">
          <div className="relative z-10 flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Vous êtes commerçant ?
              </h2>
              <p className="mt-2 text-white/80">
                Publiez vos promotions et touchez des milliers de clients au Congo.
                Commencez gratuitement.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/inscription-commercant" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Créer votre boutique
              </Link>
              <Link href="/tarifs" className="rounded-lg border-2 border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
                Voir les formules
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-gray-100 bg-white py-16">
        <div className="container-congo">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="section-title">Restez informé</h2>
            <p className="section-subtitle">
              Recevez les meilleures promotions directement dans votre boîte mail
            </p>
            <form className="mt-6 flex gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="input-field flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                S&apos;inscrire
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">
              Pas de spam. Désinscription à tout moment.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
