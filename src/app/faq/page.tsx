"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const FAQS = [
  {
    q: "Qu'est-ce que Congo Soldes ?",
    r: "Congo Soldes est une plateforme digitale congolaise qui permet aux commerçants de publier leurs promotions et aux consommateurs de trouver les meilleures offres près de chez eux."
  },
  {
    q: "Comment créer un compte commerçant ?",
    r: "Cliquez sur 'Vendre sur Congo Soldes', remplissez le formulaire d'inscription avec vos informations et celles de votre boutique. Votre compte sera vérifié par notre équipe."
  },
  {
    q: "Combien coûte la publication de promotions ?",
    r: "Nous proposons plusieurs formules : Gratuite (5 promotions), Standard (15 000 FCFA/mois, 20 promotions), Premium (35 000 FCFA/mois, 50 promotions) et Entreprise (75 000 FCFA/mois, illimité)."
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    r: "Nous acceptons MTN Mobile Money, Airtel Money, les cartes VISA et MasterCard, ainsi que le paiement manuel validé par l'administrateur."
  },
  {
    q: "Comment trouver les promotions près de chez moi ?",
    r: "Utilisez la barre de recherche et les filtres par ville et quartier. Vous pouvez également activer la géolocalisation pour voir les promotions à proximité."
  },
  {
    q: "Comment contacter une boutique ?",
    r: "Chaque fiche promotion et boutique dispose d'un bouton WhatsApp et d'un numéro d'appel direct. Vous pouvez également utiliser la messagerie interne."
  },
  {
    q: "Puis-je signaler une fausse promotion ?",
    r: "Oui, chaque promotion dispose d'un bouton de signalement. Notre équipe de modération traitera votre signalement dans les plus brefs délais."
  },
  {
    q: "Comment devenir une boutique vérifiée ?",
    r: "Les boutiques vérifiées sont celles qui ont fourni tous les documents requis et dont l'identité a été confirmée par notre équipe. Contactez-nous pour plus d'informations."
  },
  {
    q: "Puis-je modifier ou supprimer une promotion ?",
    r: "Oui, depuis votre tableau de bord commerçant, vous pouvez modifier ou supprimer vos promotions à tout moment."
  },
  {
    q: "Comment sont calculés les pourcentages de réduction ?",
    r: "Le pourcentage de réduction est calculé automatiquement à partir du prix normal et du prix promotionnel que vous renseignez."
  },
]

export default function FAQPage() {
  const [ouvert, setOuvert] = useState<number | null>(null)

  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16">
        <div className="container-congo text-center">
          <HelpCircle className="mx-auto mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Foire aux questions
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Retrouvez les réponses aux questions les plus fréquentes
          </p>
        </div>
      </section>

      <section className="container-congo py-16">
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOuvert(ouvert === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
              >
                <span className="font-medium text-dark">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-gray-400 transition-transform",
                    ouvert === i && "rotate-180"
                  )}
                />
              </button>
              {ouvert === i && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="text-sm leading-relaxed text-gray-600">{faq.r}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
