import Link from "next/link"
import { Check, X, CreditCard, TrendingUp, Store, Image as ImageIcon, Star } from "lucide-react"

const FORMULES = [
  {
    nom: "Gratuit",
    prix: "0 FCFA",
    popular: false,
    features: [
      { label: "5 promotions maximum", inclu: true },
      { label: "3 photos par promotion", inclu: true },
      { label: "Statistiques de base", inclu: true },
      { label: "Visibilité normale", inclu: true },
      { label: "Promotions sponsorisées", inclu: false },
      { label: "Statistiques avancées", inclu: false },
      { label: "Support prioritaire", inclu: false },
    ],
  },
  {
    nom: "Standard",
    prix: "15 000 FCFA",
    popular: true,
    period: "/mois",
    features: [
      { label: "20 promotions maximum", inclu: true },
      { label: "10 photos par promotion", inclu: true },
      { label: "Statistiques de base", inclu: true },
      { label: "Visibilité normale", inclu: true },
      { label: "Statistiques avancées", inclu: true },
      { label: "Promotions sponsorisées", inclu: false },
      { label: "Support prioritaire", inclu: false },
    ],
  },
  {
    nom: "Premium",
    prix: "35 000 FCFA",
    popular: false,
    period: "/mois",
    features: [
      { label: "50 promotions maximum", inclu: true },
      { label: "20 photos par promotion", inclu: true },
      { label: "Statistiques de base", inclu: true },
      { label: "Visibilité normale", inclu: true },
      { label: "Statistiques avancées", inclu: true },
      { label: "Promotions sponsorisées", inclu: true },
      { label: "Support prioritaire", inclu: false },
    ],
  },
  {
    nom: "Entreprise",
    prix: "75 000 FCFA",
    popular: false,
    period: "/mois",
    features: [
      { label: "Promotions illimitées", inclu: true },
      { label: "Photos illimitées", inclu: true },
      { label: "Statistiques de base", inclu: true },
      { label: "Visibilité normale", inclu: true },
      { label: "Statistiques avancées", inclu: true },
      { label: "Promotions sponsorisées", inclu: true },
      { label: "Support prioritaire", inclu: true },
    ],
  },
]

export default function TarifsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16">
        <div className="container-congo text-center">
          <CreditCard className="mx-auto mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Tarifs et abonnements
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Choisissez la formule qui correspond à votre commerce
          </p>
        </div>
      </section>

      <section className="container-congo py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {FORMULES.map((formule) => (
            <div
              key={formule.nom}
              className={`card relative p-6 ${formule.popular ? "border-primary-500 ring-2 ring-primary-500" : ""}`}
            >
              {formule.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold text-white">
                  Le plus populaire
                </div>
              )}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-dark">{formule.nom}</h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-dark">{formule.prix}</span>
                  {formule.period && <span className="text-sm text-gray-500">{formule.period}</span>}
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {formule.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {feat.inclu ? (
                      <Check className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-gray-300" />
                    )}
                    <span className={feat.inclu ? "text-gray-700" : "text-gray-400"}>{feat.label}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/inscription-commercant"
                className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                  formule.popular
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "border-2 border-primary-500 text-primary-500 hover:bg-primary-50"
                }`}
              >
                {formule.nom === "Gratuit" ? "Commencer gratuitement" : "Choisir cette formule"}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="section-title mb-8 text-center">Services complémentaires</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icone: <ImageIcon className="h-6 w-6" />, titre: "Création de visuels", desc: "Conception de visuels promotionnels professionnels", prix: "À partir de 25 000 FCFA" },
              { icone: <TrendingUp className="h-6 w-6" />, titre: "Campagne digitale", desc: "Gestion de campagnes marketing sur les réseaux sociaux", prix: "À partir de 50 000 FCFA" },
              { icone: <Store className="h-6 w-6" />, titre: "Shooting produit", desc: "Photographie professionnelle de vos produits", prix: "À partir de 35 000 FCFA" },
              { icone: <Star className="h-6 w-6" />, titre: "Accompagnement marketing", desc: "Stratégie marketing personnalisée pour votre commerce", prix: "Sur devis" },
            ].map((service, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
                  {service.icone}
                </div>
                <h3 className="font-semibold text-dark">{service.titre}</h3>
                <p className="mt-2 text-sm text-gray-600">{service.desc}</p>
                <p className="mt-3 text-sm font-semibold text-primary-500">{service.prix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
