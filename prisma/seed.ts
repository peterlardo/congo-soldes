import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import { slugify } from "../src/lib/utils"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Début du seed...")

  // Clean existing data
  await prisma.journalActivite.deleteMany()
  await prisma.signalement.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.paiement.deleteMany()
  await prisma.abonnement.deleteMany()
  await prisma.avis.deleteMany()
  await prisma.historiqueConsultation.deleteMany()
  await prisma.suiviBoutique.deleteMany()
  await prisma.favori.deleteMany()
  await prisma.photoPromotion.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.galeriePhoto.deleteMany()
  await prisma.boutique.deleteMany()
  await prisma.parametresUtilisateur.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.publicite.deleteMany()
  await prisma.quartier.deleteMany()
  await prisma.ville.deleteMany()
  await prisma.sousCategorie.deleteMany()
  await prisma.categorie.deleteMany()
  await prisma.user.deleteMany()

  console.log("✅ Base de données nettoyée")

  // Create admin
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.create({
    data: {
      email: "admin@congosoldes.cg",
      motDePasse: adminPassword,
      nom: "Admin",
      prenom: "Super",
      telephone: "+242 05 000 00 01",
      role: "ADMIN",
      emailVerifie: true,
      parametres: { create: {} },
    },
  })
  console.log("✅ Admin créé: admin@congosoldes.cg / admin123")

  // Create categories
  const categoriesData = [
    { nom: "Mode et vêtements", slug: "mode-et-vetements", icone: "👕", description: "Vêtements, accessoires de mode" },
    { nom: "Chaussures", slug: "chaussures", icone: "👟", description: "Tous types de chaussures" },
    { nom: "Téléphones et accessoires", slug: "telephones-et-accessoires", icone: "📱", description: "Smartphones, tablettes, accessoires" },
    { nom: "Informatique", slug: "informatique", icone: "💻", description: "Ordinateurs, périphériques, logiciels" },
    { nom: "Électroménager", slug: "electromenager", icone: "🔌", description: "Appareils électroménagers" },
    { nom: "Beauté et cosmétique", slug: "beaute-et-cosmetique", icone: "💄", description: "Produits de beauté et cosmétiques" },
    { nom: "Alimentation", slug: "alimentation", icone: "🍎", description: "Produits alimentaires" },
    { nom: "Restaurants et fast-food", slug: "restaurants-et-fast-food", icone: "🍔", description: "Restauration" },
    { nom: "Meubles et décoration", slug: "meubles-et-decoration", icone: "🪑", description: "Mobilier et décoration" },
    { nom: "Supermarchés", slug: "supermarches", icone: "🛒", description: "Grandes surfaces" },
    { nom: "Quincaillerie", slug: "quincaillerie", icone: "🔧", description: "Matériaux, outillage" },
    { nom: "Automobile", slug: "automobile", icone: "🚗", description: "Véhicules et accessoires" },
    { nom: "Enfants et bébés", slug: "enfants-et-bebes", icone: "🧸", description: "Articles pour enfants" },
    { nom: "Services", slug: "services", icone: "🛠️", description: "Prestations de services" },
    { nom: "Santé et bien-être", slug: "sante-et-bien-etre", icone: "💊", description: "Santé, bien-être" },
    { nom: "Événementiel", slug: "evenementiel", icone: "🎉", description: "Événements, fêtes" },
    { nom: "Immobilier", slug: "immobilier", icone: "🏠", description: "Biens immobiliers" },
    { nom: "Divers", slug: "divers", icone: "📦", description: "Autres" },
  ]

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.categorie.create({ data: cat })
    )
  )
  console.log(`✅ ${categories.length} catégories créées`)

  // Create cities
  const villesData = [
    "Brazzaville", "Pointe-Noire", "Dolisie", "Ouesso", "Nkayi",
    "Oyo", "Owando", "Impfondo", "Sibiti", "Kinkala",
  ]

  const villes = await Promise.all(
    villesData.map((nom) =>
      prisma.ville.create({ data: { nom, slug: slugify(nom) } })
    )
  )
  console.log(`✅ ${villes.length} villes créées`)

  // Create a test merchant
  const merchantPassword = await hash("commercant123", 12)
  const merchant = await prisma.user.create({
    data: {
      email: "commercant@test.cg",
      motDePasse: merchantPassword,
      nom: "Mbemba",
      prenom: "Jean",
      telephone: "+242 05 000 00 02",
      role: "COMMERCANT",
      emailVerifie: true,
      parametres: { create: {} },
    },
  })

  const boutique = await prisma.boutique.create({
    data: {
      proprietaireId: merchant.id,
      nom: "Tech Store Congo",
      slug: "tech-store-congo",
      description: "Votre magasin de référence pour tout l'univers de la technologie au Congo.",
      villeId: villes[0].id,
      quartier: "Centre-ville",
      telephone: "+242 05 000 00 03",
      whatsapp: "+242 05 000 00 03",
      email: "contact@techstore.cg",
      horaires: "Lun-Sam: 08h00-19h00",
      verifie: true,
    },
  })

  await prisma.abonnement.create({
    data: {
      boutiqueId: boutique.id,
      type: "STANDARD",
      dateDebut: new Date(),
      dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      actif: true,
      maxPromotions: 20,
      maxPhotos: 10,
      statistiquesAvancees: true,
    },
  })

  // Create sample promotions
  const promosData = [
    { nom: "Smartphone Samsung Galaxy A54 128GB", prixN: 450000, prixP: 329000, cat: categories[2] },
    { nom: "Pack Familial - 10kg Riz + 5L Huile + 2kg Sucre", prixN: 35000, prixP: 25500, cat: categories[6] },
    { nom: "Canapé 3 places cuir véritable", prixN: 850000, prixP: 599000, cat: categories[8] },
    { nom: "Parfum Iconique 100ml", prixN: 120000, prixP: 60000, cat: categories[5] },
    { nom: "Menu Big Burger + Frites + Boisson", prixN: 8500, prixP: 5500, cat: categories[7] },
    { nom: "Climatiseur 12000 BTU Inverter", prixN: 650000, prixP: 449000, cat: categories[4] },
  ]

  for (const promo of promosData) {
    await prisma.promotion.create({
      data: {
        boutiqueId: boutique.id,
        nom: promo.nom,
        slug: slugify(promo.nom) + "-" + Date.now().toString(36),
        descriptionCourte: `Promotion exceptionnelle sur ${promo.nom}`,
        descriptionDetaillee: `Profitez de cette offre exceptionnelle chez ${boutique.nom}. Prix imbattable !`,
        prixNormal: promo.prixN,
        prixPromotionnel: promo.prixP,
        pourcentageReduction: Math.round((1 - promo.prixP / promo.prixN) * 100),
        stockDisponible: Math.floor(Math.random() * 50) + 10,
        dateDebut: new Date(),
        dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        statut: "ACTIF",
        categorieId: promo.cat.id,
      },
    })
  }
  console.log(`✅ ${promosData.length} promotions créées`)

  // Create a test client
  const clientPassword = await hash("client123", 12)
  await prisma.user.create({
    data: {
      email: "client@test.cg",
      motDePasse: clientPassword,
      nom: "Nkosi",
      prenom: "Marie",
      telephone: "+242 05 000 00 04",
      role: "CLIENT",
      emailVerifie: true,
      parametres: { create: {} },
    },
  })

  console.log("✅ Client créé: client@test.cg / client123")
  console.log("🎉 Seed terminé avec succès !")
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
