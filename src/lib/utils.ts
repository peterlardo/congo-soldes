import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isPast, isFuture } from "date-fns"
import { fr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrix(prix: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(prix)
}

export function calculerReduction(prixNormal: number, prixPromo: number): number {
  if (prixNormal <= 0 || prixPromo >= prixNormal) return 0
  return Math.round(((prixNormal - prixPromo) / prixNormal) * 100)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "dd MMMM yyyy", { locale: fr })
}

export function formatDateCourt(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "dd/MM/yyyy", { locale: fr })
}

export function tempsRestant(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (isPast(d)) return "Expiré"
  return formatDistanceToNow(d, { addSuffix: true, locale: fr })
}

export function estExpire(dateFin: Date | string): boolean {
  const d = typeof dateFin === "string" ? new Date(dateFin) : dateFin
  return isPast(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function genererReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CS-${timestamp}-${random}`
}

export function getInitiales(nom: string): string {
  return nom
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function calculerDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
  ): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getNotificationLabel(type: string): string {
  const labels: Record<string, string> = {
    WELCOME: "Bienvenue",
    SHOP_PENDING_VALIDATION: "Boutique en attente",
    SHOP_APPROVED: "Boutique approuvée",
    SHOP_REJECTED: "Boutique refusée",
    PROMOTION_APPROVED: "Promotion approuvée",
    PROMOTION_REJECTED: "Promotion refusée",
    PROMOTION_EXPIRED: "Promotion expirée",
    NEW_PROMOTION_FROM_FOLLOWED_SHOP: "Nouvelle promotion",
    PAYMENT_RECEIVED: "Paiement reçu",
    SUBSCRIPTION_EXPIRING: "Abonnement expirant",
    CAMPAIGN_APPROVED: "Campagne approuvée",
    PROMOTION_REPORTED: "Promotion signalée",
    NEW_REVIEW: "Nouvel avis",
    NEW_MESSAGE: "Nouveau message",
    SYSTEM_ALERT: "Alerte système",
  }
  return labels[type] ?? type
}

export function formatTaux(taux: number): string {
  return `${(taux * 100).toFixed(0)}%`
}

export function tronquerTexte(texte: string, max: number): string {
  if (texte.length <= max) return texte
  return texte.substring(0, max) + "..."
}

export function validerEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validerTelephone(telephone: string): boolean {
  return /^(\+242)?0[56]\d{7,8}$/.test(telephone.replace(/\s/g, ""))
}

export function genererMotDePasse(longueur: number = 16): string {
  const minuscules = "abcdefghijklmnopqrstuvwxyz"
  const majuscules = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const chiffres = "0123456789"
  const tous = minuscules + majuscules + chiffres
  let mdp = ""
  mdp += minuscules[Math.floor(Math.random() * minuscules.length)]
  mdp += majuscules[Math.floor(Math.random() * majuscules.length)]
  mdp += chiffres[Math.floor(Math.random() * chiffres.length)]
  for (let i = mdp.length; i < longueur; i++) {
    mdp += tous[Math.floor(Math.random() * tous.length)]
  }
  return mdp.split("").sort(() => Math.random() - 0.5).join("")
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Administrateur",
    MODERATOR: "Modérateur",
    MERCHANT: "Commerçant",
    SHOP_MANAGER: "Gérant",
    CLIENT: "Client",
    VISITOR: "Visiteur",
  }
  return labels[role] ?? role
}

export function getStatusCouleur(status: string): string {
  const couleurs: Record<string, string> = {
    ACTIVE: "green",
    APPROVED: "green",
    COMPLETED: "green",
    PENDING: "yellow",
    PENDING_VERIFICATION: "yellow",
    INACTIVE: "gray",
    EXPIRED: "red",
    REJECTED: "red",
    SUSPENDED: "red",
    CANCELLED: "red",
    ARCHIVED: "gray",
    PENDING_PAYMENT: "yellow",
  }
  return couleurs[status] ?? "gray"
}

export function getTempsRestant(date: Date | string): string {
  return tempsRestant(date)
}

export const CATEGORIES = [
  { nom: "Mode et vêtements", slug: "mode-et-vetements", icone: "👕" },
  { nom: "Chaussures", slug: "chaussures", icone: "👟" },
  { nom: "Téléphones et accessoires", slug: "telephones-et-accessoires", icone: "📱" },
  { nom: "Informatique", slug: "informatique", icone: "💻" },
  { nom: "Électroménager", slug: "electromenager", icone: "🔌" },
  { nom: "Beauté et cosmétique", slug: "beaute-et-cosmetique", icone: "💄" },
  { nom: "Alimentation", slug: "alimentation", icone: "🍎" },
  { nom: "Restaurants et fast-food", slug: "restaurants-et-fast-food", icone: "🍔" },
  { nom: "Meubles et décoration", slug: "meubles-et-decoration", icone: "🪑" },
  { nom: "Supermarchés", slug: "supermarches", icone: "🛒" },
  { nom: "Quincaillerie", slug: "quincaillerie", icone: "🔧" },
  { nom: "Automobile", slug: "automobile", icone: "🚗" },
  { nom: "Enfants et bébés", slug: "enfants-et-bebes", icone: "🧸" },
  { nom: "Services", slug: "services", icone: "🛠️" },
  { nom: "Santé et bien-être", slug: "sante-et-bien-etre", icone: "💊" },
  { nom: "Événementiel", slug: "evenementiel", icone: "🎉" },
  { nom: "Immobilier", slug: "immobilier", icone: "🏠" },
  { nom: "Divers", slug: "divers", icone: "📦" },
]

export const VILLES_CONGO = [
  "Brazzaville",
  "Pointe-Noire",
  "Dolisie",
  "Ouesso",
  "Nkayi",
  "Oyo",
  "Owando",
  "Impfondo",
  "Sibiti",
  "Kinkala",
  "Madingou",
  "Gamboma",
  "Djambala",
  "Mossendjo",
  "Makoua",
  "Ewo",
  "Sembe",
  "Kelle",
  "Boundji",
]

export const ABONNEMENTS = {
  GRATUIT: { maxPromotions: 5, maxPhotos: 3, sponsorise: false, statistiquesAvancees: false, prix: 0 },
  STANDARD: { maxPromotions: 20, maxPhotos: 10, sponsorise: false, statistiquesAvancees: true, prix: 15000 },
  PREMIUM: { maxPromotions: 50, maxPhotos: 20, sponsorise: true, statistiquesAvancees: true, prix: 35000 },
  ENTREPRISE: { maxPromotions: -1, maxPhotos: -1, sponsorise: true, statistiquesAvancees: true, prix: 75000 },
}

export function getAbonnementLabel(type: string): string {
  const labels: Record<string, string> = {
    GRATUIT: "Gratuit",
    STANDARD: "Standard",
    PREMIUM: "Premium",
    ENTREPRISE: "Entreprise",
  }
  return labels[type] ?? type
}

export function getStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    ACTIF: "Actif",
    ACTIVE: "Actif",
    APPROVED: "Approuvé",
    PENDING: "En attente",
    EN_ATTENTE: "En attente",
    PENDING_VERIFICATION: "En attente",
    PENDING_PAYMENT: "En attente",
    COMPLETED: "Valide",
    VALIDE: "Valide",
    EXPIRED: "Expiré",
    REJECTED: "Refusé",
    REFUSE: "Refusé",
    SUSPENDED: "Suspendu",
    CANCELLED: "Annulé",
    ARCHIVED: "Archivé",
    INACTIVE: "Inactif",
  }
  return labels[statut] ?? statut
}
