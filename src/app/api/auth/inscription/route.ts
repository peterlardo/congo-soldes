import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName, lastName, email, phone, password, role,
      shopName, shopDescription, shopAddress, arrondissementId,
      district, shopPhone, shopWhatsapp, shopCategoryId,
    } = body

    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || "",
        email,
        phone: phone || null,
        passwordHash,
        role: role || "CLIENT",
        status: "PENDING_VERIFICATION",
      },
    })

    sendWelcomeEmail(user.email, user.firstName).catch(() => {})

    if (role === "MERCHANT" && shopName) {
      const slug = slugify(shopName) + "-" + Date.now().toString(36)

      const shop = await prisma.shop.create({
        data: {
          ownerId: user.id,
          name: shopName,
          slug,
          description: shopDescription || null,
          address: shopAddress || null,
          arrondissementId: arrondissementId || null,
          district: district || null,
          phone: shopPhone || phone || null,
          whatsapp: shopWhatsapp || phone || null,
          categoryId: shopCategoryId || null,
          verificationStatus: "PENDING",
          status: "PENDING",
        },
      })

      // Create free subscription
      const freePlan = await prisma.subscriptionPlan.findFirst({
        where: { type: "FREE", status: true },
      })

      if (freePlan) {
        await prisma.shopSubscription.create({
          data: {
            shopId: shop.id,
            subscriptionPlanId: freePlan.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: "ACTIVE",
          },
        })
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REGISTRATION",
        entityType: "User",
        entityId: user.id,
        newValues: { role },
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