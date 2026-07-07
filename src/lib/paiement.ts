import { prisma } from "./prisma"
import { genererReference } from "./utils"

interface PaiementInit {
  abonnementId: string
  montant: number
  moyen: "MTN_MONEY" | "AIRTEL_MONEY" | "VISA" | "MASTERCARD" | "MANUEL"
  telephone?: string
  email?: string
}

export async function initierPaiement(data: PaiementInit) {
  const reference = genererReference()

  const paiement = await prisma.paiement.create({
    data: {
      abonnementId: data.abonnementId,
      montant: data.montant,
      moyen: data.moyen,
      statut: "EN_ATTENTE",
      reference,
      telephonePaiement: data.telephone || null,
      emailPaiement: data.email || null,
    },
  })

  if (data.moyen === "MANUEL") {
    // Paiement manuel - en attente de validation admin
    return {
      success: true,
      reference,
      instructions:
        "Veuillez effectuer le paiement et contacter l'administrateur pour validation.",
    }
  }

  if (data.moyen === "MTN_MONEY" || data.moyen === "AIRTEL_MONEY") {
    // Simulation mobile money
    const mobileMoneyResult = await simulerPaiementMobile(
      data.moyen,
      data.telephone || "",
      data.montant,
      reference
    )

    if (mobileMoneyResult.success) {
      await prisma.paiement.update({
        where: { id: paiement.id },
        data: {
          transactionId: mobileMoneyResult.transactionId,
          statut: "VALIDE",
          valideLe: new Date(),
        },
      })

      await activerAbonnement(data.abonnementId)
    }

    return mobileMoneyResult
  }

  // Carte bancaire - simulation
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
  // Simulation d'appel API MTN/Airtel
  // Dans un environnement de production, remplacer par l'API réelle
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  return {
    success: true,
    transactionId,
    reference,
    message: `Paiement de ${montant} FCFA via ${operateur} (${telephone}) réussi. Transaction: ${transactionId}`,
  }
}

async function activerAbonnement(abonnementId: string) {
  const abonnement = await prisma.abonnement.findUnique({
    where: { id: abonnementId },
  })

  if (!abonnement) return

  const dureeMois = abonnement.type === "ENTREPRISE" ? 12 : 1
  const dateFin = new Date()
  dateFin.setMonth(dateFin.getMonth() + dureeMois)

  await prisma.abonnement.update({
    where: { id: abonnementId },
    data: {
      actif: true,
      dateDebut: new Date(),
      dateFin,
      renouvellementAuto: true,
    },
  })
}

export async function validerPaiementManuel(
  paiementId: string,
  adminId: string
) {
  const paiement = await prisma.paiement.update({
    where: { id: paiementId },
    data: {
      statut: "VALIDE",
      validePar: adminId,
      valideLe: new Date(),
    },
  })

  await activerAbonnement(paiement.abonnementId)

  return paiement
}
