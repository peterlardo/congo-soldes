import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, prenom, email, telephone, motDePasse, role, boutiqueNom, boutiqueDescription, ville, quartier } = body

    if (!email || !motDePasse || !nom) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    const hashedPassword = await hash(motDePasse, 12)

    const user = await prisma.user.create({
      data: {
        email,
        motDePasse: hashedPassword,
        nom,
        prenom,
        telephone: telephone || null,
        role: role || "CLIENT",
        parametres: {
          create: {},
        },
      },
    })

    if (role === "COMMERCANT" && boutiqueNom) {
      const villeRecord = ville
        ? await prisma.ville.findUnique({ where: { nom: ville } })
        : null

      const boutique = await prisma.boutique.create({
        data: {
          proprietaireId: user.id,
          nom: boutiqueNom,
          slug: slugify(boutiqueNom) + "-" + Date.now().toString(36),
          description: boutiqueDescription || null,
          villeId: villeRecord?.id || null,
          quartier: quartier || null,
        },
      })

      await prisma.abonnement.create({
        data: {
          boutiqueId: boutique.id,
          type: "GRATUIT",
          dateDebut: new Date(),
        },
      })
    }

    await prisma.journalActivite.create({
      data: {
        userId: user.id,
        action: "INSCRIPTION",
        details: `Inscription en tant que ${role}`,
      },
    })

    return NextResponse.json(
      { message: "Compte créé avec succès", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur inscription:", error)
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
  }
}
