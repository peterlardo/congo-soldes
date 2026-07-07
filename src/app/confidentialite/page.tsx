import { Shield } from "lucide-react"

export default function ConfidentialitePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16">
        <div className="container-congo text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Politique de confidentialité
          </h1>
        </div>
      </section>

      <section className="container-congo py-16">
        <div className="mx-auto max-w-3xl prose prose-gray">
          <h2>1. Collecte des données</h2>
          <p>
            Nous collectons les données suivantes : nom, prénom, adresse email, numéro de téléphone,
            informations de paiement, données de navigation et de localisation (si activée).
          </p>

          <h2>2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées pour : la gestion de votre compte, la publication de promotions,
            la communication entre utilisateurs, l&apos;envoi de notifications et d&apos;offres personnalisées,
            l&apos;amélioration de nos services.
          </p>

          <h2>3. Partage des données</h2>
          <p>
            Nous ne partageons pas vos données avec des tiers sans votre consentement, sauf obligation légale.
            Les informations de votre boutique sont visibles publiquement sur la plateforme.
          </p>

          <h2>4. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données
            contre tout accès non autorisé, modification, divulgation ou destruction.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur la plateforme.
            Vous pouvez configurer vos préférences de cookies dans les paramètres de votre navigateur.
          </p>

          <h2>6. Vos droits</h2>
          <p>
            Vous avez le droit d&apos;accéder, rectifier, supprimer vos données et de vous opposer
            à leur traitement. Pour exercer ces droits, contactez-nous à contact@congosoldes.cg.
          </p>

          <h2>7. Contact</h2>
          <p>
            Pour toute question relative à la protection des données : contact@congosoldes.cg
          </p>
        </div>
      </section>
    </>
  )
}
