import { prisma } from "./prisma"

const NOTIFICATION_LABELS: Record<string, string> = {
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

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: Record<string, any>,
  link?: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title: title || NOTIFICATION_LABELS[type] || type,
        message,
        type: type as any,
        data: { ...(data || {}), link } as any,
      },
    })
    return notification
  } catch (error) {
    console.error("Erreur création notification:", error)
    return null
  }
}

export async function notifyNewPromotion(promotionId: string) {
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    include: {
      shop: true,
      category: true,
    },
  })

  if (!promotion) return

  const followers = await prisma.shopFollower.findMany({
    where: { shopId: promotion.shopId },
    include: { user: true },
  })

  for (const follow of followers) {
    await createNotification(
      follow.userId,
      "NEW_PROMOTION_FROM_FOLLOWED_SHOP",
      "Nouvelle promotion",
      `${promotion.shop.name} a publié : ${promotion.title} à ${promotion.newPrice.toLocaleString("fr-FR")} FCFA`,
      { promotionId, shopId: promotion.shopId },
      `/promotions/${promotion.slug}`
    )
  }
}

export async function notifyPromotionApproved(promotionId: string) {
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    include: { shop: { include: { owner: true } } },
  })

  if (!promotion) return

  await createNotification(
    promotion.shop.ownerId,
    "PROMOTION_APPROVED",
    "Promotion approuvée",
    `Votre promotion "${promotion.title}" a été approuvée et est en ligne !`,
    { promotionId },
    `/commercant/promotions`
  )
}

export async function notifyPromotionRejected(promotionId: string, reason: string) {
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    include: { shop: { include: { owner: true } } },
  })

  if (!promotion) return

  await createNotification(
    promotion.shop.ownerId,
    "PROMOTION_REJECTED",
    "Promotion refusée",
    `Votre promotion "${promotion.title}" a été refusée. Raison : ${reason}`,
    { promotionId, reason },
    `/commercant/promotions`
  )
}

export async function notifySubscriptionExpiring() {
  const in7Days = new Date()
  in7Days.setDate(in7Days.getDate() + 7)

  const expiringSubscriptions = await prisma.shopSubscription.findMany({
    where: {
      status: "ACTIVE",
      endDate: { lte: in7Days, not: null },
    },
    include: { shop: { include: { owner: true } } },
  })

  for (const sub of expiringSubscriptions) {
    await createNotification(
      sub.shop.ownerId,
      "SUBSCRIPTION_EXPIRING",
      "Abonnement expirant",
      `Votre abonnement expire dans moins de 7 jours. Renouvelez-le pour continuer à profiter de vos avantages.`,
      { subscriptionId: sub.id, endDate: sub.endDate },
      `/commercant/abonnement`
    )
  }
}

export async function notifyShopApproved(shopId: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: { owner: true },
  })

  if (!shop) return

  await createNotification(
    shop.ownerId,
    "SHOP_APPROVED",
    "Boutique approuvée",
    `Félicitations ! Votre boutique "${shop.name}" a été approuvée. Vous pouvez maintenant publier des promotions.`,
    { shopId },
    `/commercant/boutique`
  )
}

export async function notifyPaymentReceived(shopId: string, amount: number) {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: { owner: true },
  })

  if (!shop) return

  await createNotification(
    shop.ownerId,
    "PAYMENT_RECEIVED",
    "Paiement reçu",
    `Paiement de ${amount.toLocaleString("fr-FR")} FCFA reçu avec succès. Merci !`,
    { shopId, amount },
    `/commercant/paiements`
  )
}