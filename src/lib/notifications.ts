import { prisma } from "./prisma"

type NotificationType =
  | "NOUVELLE_PROMOTION"
  | "PROMOTION_EXPIRATION"
  | "VALIDATION_PROMOTION"
  | "REJET_PROMOTION"
  | "NOUVEAU_MESSAGE"
  | "ABONNEMENT_EXPIRATION"
  | "SUIVI_BOUTIQUE"
  | "PROMOTION_PROXIMITE"
  | "OFFRE_SPECIALE"

const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  NOUVELLE_PROMOTION: "Nouvelle promotion",
  PROMOTION_EXPIRATION: "Promotion bientôt expirée",
  VALIDATION_PROMOTION: "Promotion validée",
  REJET_PROMOTION: "Promotion rejetée",
  NOUVEAU_MESSAGE: "Nouveau message",
  ABONNEMENT_EXPIRATION: "Abonnement expirant",
  SUIVI_BOUTIQUE: "Nouvelle boutique suivie",
  PROMOTION_PROXIMITE: "Promotion près de chez vous",
  OFFRE_SPECIALE: "Offre spéciale",
}

export async function creerNotification(
  userId: string,
  type: NotificationType,
  message: string,
  lien?: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        titre: NOTIFICATION_LABELS[type],
        message,
        type,
        lien: lien || null,
      },
    })

    return notification
  } catch (error) {
    console.error("Erreur création notification:", error)
    return null
  }
}

export async function notifierNouvellePromotion(promotionId: string) {
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    include: {
      boutique: true,
      categorie: true,
      favoris: { include: { user: true } },
    },
  })

  if (!promotion) return

  // Notify followers of the boutique
  const suiveurs = await prisma.suiviBoutique.findMany({
    where: { boutiqueId: promotion.boutiqueId },
    include: { user: { include: { parametres: true } } },
  })

  for (const suivi of suiveurs) {
    if (suivi.user.parametres?.alerteNouveautes) {
      await creerNotification(
        suivi.userId,
        "NOUVELLE_PROMOTION",
        `${promotion.boutique.nom} a publié: ${promotion.nom} à ${promotion.prixPromotionnel} FCFA`,
        `/promotions/${promotion.slug}`
      )
    }
  }
}

export async function notifierPromotionExpiration() {
  const dans3Jours = new Date()
  dans3Jours.setDate(dans3Jours.getDate() + 3)

  const promos = await prisma.promotion.findMany({
    where: {
      statut: "ACTIF",
      dateFin: { lte: dans3Jours },
    },
    include: { boutique: true },
  })

  for (const promo of promos) {
    const commercant = await prisma.user.findUnique({
      where: { id: promo.boutique.proprietaireId },
    })
    if (commercant) {
      await creerNotification(
        commercant.id,
        "PROMOTION_EXPIRATION",
        `Votre promotion "${promo.nom}" expire bientôt`,
        `/commercant/promotions`
      )
    }
  }
}

export async function notifierValidationPromotion(
  promotionId: string,
  statut: "ACTIF" | "REJETE"
) {
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    include: { boutique: { include: { proprietaire: true } } },
  })

  if (!promotion) return

  await creerNotification(
    promotion.boutique.proprietaireId,
    statut === "ACTIF" ? "VALIDATION_PROMOTION" : "REJET_PROMOTION",
    statut === "ACTIF"
      ? `Votre promotion "${promotion.nom}" a été approuvée et est en ligne !`
      : `Votre promotion "${promotion.nom}" a été rejetée`,
    `/commercant/promotions`
  )
}

export async function notifierAbonnementExpiration() {
  const dans7Jours = new Date()
  dans7Jours.setDate(dans7Jours.getDate() + 7)

  const abonnements = await prisma.abonnement.findMany({
    where: {
      actif: true,
      dateFin: { lte: dans7Jours, not: null },
    },
    include: { boutique: { include: { proprietaire: true } } },
  })

  for (const abo of abonnements) {
    await creerNotification(
      abo.boutique.proprietaireId,
      "ABONNEMENT_EXPIRATION",
      `Votre abonnement ${abo.type} expire dans moins de 7 jours. Renouvelez-le pour continuer à publier.`,
      `/commercant/abonnement`
    )
  }
}
