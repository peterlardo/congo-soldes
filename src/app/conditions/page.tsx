import { FileText } from "lucide-react"

export default function ConditionsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16">
        <div className="container-congo text-center">
          <FileText className="mx-auto mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Conditions générales d&apos;utilisation
          </h1>
        </div>
      </section>

      <section className="container-congo py-16">
        <div className="mx-auto max-w-3xl prose prose-gray">
          <h2>1. Présentation de la plateforme</h2>
          <p>
            Congo Soldes est une plateforme en ligne permettant aux commerçants de publier leurs promotions
            et aux consommateurs de consulter ces offres. La plateforme est accessible via le site web
            et les applications mobiles.
          </p>

          <h2>2. Définitions</h2>
          <p>
            &ldquo;Plateforme&rdquo; : désigne le site internet Congo Soldes et ses applications mobiles.
            &ldquo;Utilisateur&rdquo; : toute personne utilisant la plateforme.
            &ldquo;Client&rdquo; : utilisateur inscrit en tant que consommateur.
            &ldquo;Commerçant&rdquo; : utilisateur inscrit en tant que professionnel publiant des promotions.
          </p>

          <h2>3. Inscription et compte</h2>
          <p>
            L&apos;inscription est gratuite. L&apos;utilisateur s&apos;engage à fournir des informations exactes
            et à les tenir à jour. Le compte est personnel et non transférable.
          </p>

          <h2>4. Publications des promotions</h2>
          <p>
            Les commerçants s&apos;engagent à publier des offres réelles et conformes à la législation en vigueur.
            Congo Soldes se réserve le droit de refuser ou supprimer toute promotion ne respectant pas
            les conditions générales.
          </p>

          <h2>5. Responsabilités</h2>
          <p>
            Congo Soldes joue un rôle d&apos;intermédiaire et n&apos;est pas partie aux transactions entre
            commerçants et clients. La plateforme ne peut être tenue responsable des litiges commerciaux.
          </p>

          <h2>6. Protection des données</h2>
          <p>
            Les données personnelles sont traitées conformément à notre politique de confidentialité.
            Conformément à la réglementation en vigueur, vous disposez d&apos;un droit d&apos;accès,
            de rectification et de suppression de vos données.
          </p>

          <h2>7. Propriété intellectuelle</h2>
          <p>
            Tous les contenus de la plateforme (logo, design, textes) sont la propriété de Congo Soldes.
            Leur reproduction est interdite sans autorisation préalable.
          </p>

          <h2>8. Modification des conditions</h2>
          <p>
            Congo Soldes se réserve le droit de modifier les présentes conditions à tout moment.
            Les utilisateurs seront informés des modifications significatives.
          </p>

          <h2>9. Contact</h2>
          <p>
            Pour toute question, contactez-nous à contact@congosoldes.cg ou au +242 05 555 55 55.
          </p>
        </div>
      </section>
    </>
  )
}
