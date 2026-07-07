import Link from "next/link"
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="container-congo py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary-500" />
              <span className="font-display text-xl font-bold text-dark">
                Congo <span className="text-primary-500">Soldes</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              La plateforme congolaise des bonnes affaires. Trouvez les meilleures promotions près de chez vous.
            </p>
            <p className="mt-2 text-sm italic text-primary-600">
              &ldquo;La qualité au petit prix&rdquo;
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-colors hover:bg-primary-500 hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-colors hover:bg-primary-500 hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-colors hover:bg-primary-500 hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-colors hover:bg-primary-500 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark">
              Liens rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/promotions" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Toutes les promotions
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/boutiques" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Boutiques
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Tarifs et abonnements
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark">
              Commerçants
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/inscription-commercant" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Créer votre boutique
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Nos formules
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Centre d&apos;aide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-primary-500">
                  Blog commerçant
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                Brazzaville, République du Congo
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 shrink-0 text-primary-500" />
                +242 05 555 55 55
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 shrink-0 text-primary-500" />
                contact@congosoldes.cg
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Congo Soldes. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link href="/conditions" className="text-xs text-gray-500 transition-colors hover:text-primary-500">
                Conditions générales
              </Link>
              <Link href="/confidentialite" className="text-xs text-gray-500 transition-colors hover:text-primary-500">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
