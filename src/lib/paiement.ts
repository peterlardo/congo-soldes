import { prisma } from "./prisma"
import { genererReference } from "./utils"

interface PaiementInit {
  shopId: string
  subscriptionPlanId: string
  montant: number
  moyen: "MTN_MONEY" | "AIRTEL_MONEY" | "VISA" | "MASTERCARD" | "MANUEL"
  telephone?: string
  email?: string
}

export async function initierPaiement(data: PaiementInit) {
  const reference = genererReference()

  const paiement = await prisma.payment.create({
    data: {
      shopId: data.shopId,
      amount: data.montant,
      paymentMethod: data.moyen as any,
      paymentStatus: "PENDING",
      paymentType: "SUBSCRIPTION",
      transactionReference: reference,
      metadata: { telephone: data.telephone, email: data.email, subscriptionPlanId: data.subscriptionPlanId },
    },
  })

  if (data.moyen === "MANUEL") {
    return {
      success: true,
      reference,
      instructions:
        "Veuillez effectuer le paiement et contacter l'administrateur pour validation.",
    }
  }

  if (data.moyen === "MTN_MONEY" || data.moyen === "AIRTEL_MONEY") {
    const mobileMoneyResult = await simulerPaiementMobile(
      data.moyen,
      data.telephone || "",
      data.montant,
      reference
    )

    if (mobileMoneyResult.success) {
      await prisma.payment.update({
        where: { id: paiement.id },
        data: {
          transactionReference: mobileMoneyResult.transactionId,
          paymentStatus: "COMPLETED",
          paidAt: new Date(),
        },
      })

      await activerAbonnement(data.shopId, data.subscriptionPlanId)
    }

    return mobileMoneyResult
  }

  return {
    success: true,
    reference,
    redirectUrl: `/api/paiement/carte?reference=${reference}&montant=${data.montant}`,
  }
}

async function simulerPaiementMobile(
  operateur: string,
  telephone: string,
  montant: number,
  reference: string
) {
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  return {
    success: true,
    transactionId,
    reference,
    message: `Paiement de ${montant} FCFA via ${operateur} (${telephone}) réussi. Transaction: ${transactionId}`,
  }
}

async function activerAbonnement(shopId: string, subscriptionPlanId: string) {
  const subscription = await prisma.subscriptionPlan.findUnique({
    where: { id: subscriptionPlanId },
  })

  if (!subscription) return

  const dateFin = new Date()
  dateFin.setDate(dateFin.getDate() + subscription.durationDays)

  await prisma.shopSubscription.upsert({
    where: { shopId },
    create: {
      shopId,
      subscriptionPlanId,
      startDate: new Date(),
      endDate: dateFin,
      status: "ACTIVE",
    },
    update: {
      startDate: new Date(),
      endDate: dateFin,
      status: "ACTIVE",
    },
  })
}

export async function validerPaiementManuel(
  paiementId: string,
  adminId: string
) {
  const paiement = await prisma.payment.update({
    where: { id: paiementId },
    data: {
      paymentStatus: "COMPLETED",
      userId: adminId,
      paidAt: new Date(),
    },
  })

  const metadata = paiement.metadata as { shopId?: string; subscriptionPlanId?: string } | null
  if (metadata?.shopId && metadata?.subscriptionPlanId) {
    await activerAbonnement(metadata.shopId, metadata.subscriptionPlanId)
  }

  return paiement
}