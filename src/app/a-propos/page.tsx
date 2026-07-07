import { ShoppingBag, Target, Eye, Heart } from "lucide-react"

export default function AProposPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16">
        <div className="container-congo text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            À propos de Congo Soldes
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            La première plateforme congolaise des bonnes affaires
          </p>
        </div>
      </section>

      <section className="container-congo py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              Congo Soldes est une plateforme digitale congolaise qui connecte les commerçants et les consommateurs.
              Notre mission est de rendre les promotions accessibles à tous et d&apos;aider les commerces locaux à gagner en visibilité.
            </p>
            <p className="mt-4 text-lg font-semibold text-primary-500 italic">
              &ldquo;La qualité au petit prix&rdquo;
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icone: <Target className="h-8 w-8" />, titre: "Notre mission", desc: "Faciliter l'accès aux bonnes affaires pour tous les Congolais et aider les commerces à se développer." },
              { icone: <Eye className="h-8 w-8" />, titre: "Notre vision", desc: "Devenir la référence nationale des promotions et du shopping intelligent au Congo." },
              { icone: <Heart className="h-8 w-8" />, titre: "Nos valeurs", desc: "Transparence, proximité, innovation et engagement envers la communauté congolaise." },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-500">
                  {item.icone}
                </div>
                <h3 className="font-semibold text-dark">{item.titre}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-gray-50 p-8">
            <h2 className="font-display text-2xl font-bold text-dark">Présence nationale</h2>
            <p className="mt-2 text-gray-600">
              Congo Soldes est présent dans toutes les grandes villes du Congo :
              Brazzaville, Pointe-Noire, Dolisie, Ouesso, Nkayi, Oyo, Owando, Impfondo, Sibiti, Kinkala, Madingou, Gamboma, Djambala, Mossendjo, Makoua, Ewo, Sembe, Kelle, Boundji.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
