import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Démarrage du seed Congo Soldes...")

  // Clean existing data
  await prisma.analyticsEvent.deleteMany()
  await prisma.sponsoredCampaign.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.shopSubscription.deleteMany()
  await prisma.subscriptionPlan.deleteMany()
  await prisma.report.deleteMany()
  await prisma.review.deleteMany()
  await prisma.shopFollower.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.promotionMedia.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.shopManager.deleteMany()
  await prisma.shopGalleryImage.deleteMany()
  await prisma.shop.deleteMany()
  await prisma.subCategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.district.deleteMany()
  await prisma.arrondissement.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.cmsPage.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()
  await prisma.permission.deleteMany()
  await prisma.role.deleteMany()

  // 1. Create roles
  const roles = await Promise.all([
    prisma.role.create({ data: { name: "SUPER_ADMIN", description: "Super administrateur - accès total" } }),
    prisma.role.create({ data: { name: "ADMIN", description: "Administrateur - gestion plateforme" } }),
    prisma.role.create({ data: { name: "MODERATOR", description: "Modérateur - validation contenu" } }),
    prisma.role.create({ data: { name: "MERCHANT", description: "Commerçant - propriétaire boutique" } }),
    prisma.role.create({ data: { name: "SHOP_MANAGER", description: "Gestionnaire de boutique" } }),
    prisma.role.create({ data: { name: "CLIENT", description: "Client inscrit" } }),
  ])

  // 2. Create permissions
  const permissions = await Promise.all([
    prisma.permission.create({ data: { name: "manage_users", description: "Gérer les utilisateurs" } }),
    prisma.permission.create({ data: { name: "manage_shops", description: "Gérer les boutiques" } }),
    prisma.permission.create({ data: { name: "manage_promotions", description: "Gérer les promotions" } }),
    prisma.permission.create({ data: { name: "manage_categories", description: "Gérer les catégories" } }),
    prisma.permission.create({ data: { name: "manage_subscriptions", description: "Gérer les abonnements" } }),
    prisma.permission.create({ data: { name: "manage_payments", description: "Gérer les paiements" } }),
    prisma.permission.create({ data: { name: "moderate_content", description: "Modérer le contenu" } }),
    prisma.permission.create({ data: { name: "view_analytics", description: "Voir les statistiques" } }),
    prisma.permission.create({ data: { name: "manage_cms", description: "Gérer le CMS" } }),
    prisma.permission.create({ data: { name: "manage_banners", description: "Gérer les bannières" } }),
    prisma.permission.create({ data: { name: "create_promotions", description: "Créer des promotions" } }),
    prisma.permission.create({ data: { name: "view_own_stats", description: "Voir ses statistiques" } }),
    prisma.permission.create({ data: { name: "manage_own_shop", description: "Gérer sa boutique" } }),
  ])

  // 3. Link roles to permissions
  const permissionMap: Record<string, number[]> = {
    SUPER_ADMIN: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ADMIN: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    MODERATOR: [2, 6],
    MERCHANT: [10, 11, 12],
    SHOP_MANAGER: [10, 12],
    CLIENT: [],
  }

  for (const [roleName, permIndices] of Object.entries(permissionMap)) {
    const role = roles.find((r) => r.name === roleName)
    if (!role) continue
    for (const idx of permIndices) {
      await prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: permissions[idx].id },
      })
    }
  }

  // 4. Create admin users
  const adminPassword = await hash("Admin@123", 12)

  const superAdmin = await prisma.user.create({
    data: {
      firstName: "Super",
      lastName: "Admin",
      email: "admin@congosoldes.cg",
      phone: "+242000000001",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  })

  const moderatorUser = await prisma.user.create({
    data: {
      firstName: "Modérateur",
      lastName: "Congo Soldes",
      email: "moderateur@congosoldes.cg",
      phone: "+242000000002",
      passwordHash: adminPassword,
      role: "MODERATOR",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  })

  // 5. Create arrondissements of Brazzaville
  const arrondissements: any[] = []
  const arrondissementData = [
    { name: "Makélékélé", latitude: -4.3059, longitude: 15.2795 },
    { name: "Bacongo", latitude: -4.2971, longitude: 15.2851 },
    { name: "Poto-Poto", latitude: -4.2764, longitude: 15.2767 },
    { name: "Moungali", latitude: -4.2653, longitude: 15.2653 },
    { name: "Ouenzé", latitude: -4.2550, longitude: 15.2580 },
    { name: "Talangaï", latitude: -4.2430, longitude: 15.2480 },
    { name: "Mfilou", latitude: -4.2330, longitude: 15.2380 },
    { name: "Madibou", latitude: -4.2230, longitude: 15.2280 },
    { name: "Djiri", latitude: -4.2130, longitude: 15.2180 },
  ]

  for (const a of arrondissementData) {
    const arr = await prisma.arrondissement.create({
      data: {
        name: a.name,
        slug: a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
        city: "Brazzaville",
        latitude: a.latitude,
        longitude: a.longitude,
      },
    })
    arrondissements.push(arr)
  }

  // 6. Create districts for each arrondissement
  const districtData: Record<string, string[]> = {
    Makélékélé: ["Mikélékélé", "Nkombo", "Mafouta", "Mobembo", "Mfilou Ngamaba"],
    Bacongo: ["Mazda", "Mbounda", "Loulombo", "Mankondé"],
    "Poto-Poto": ["Industriel", "Moukondo", "Mikélékélé Centre"],
    Moungali: ["Moukoukoulou", "Mitendi", "Mayaba", "Dongola"],
    Ouenzé: ["Mongo-Mongo", "Makabandilou", "Ndouka", "Mbilou"],
    Talangaï: ["Mangengué", "Ngamaba", "Mambou", "Nkombo"],
    Mfilou: ["Mambém", "Ngamaba", "Ntara", "Nkodia"],
    Madibou: ["Mantouala", "Mpila", "Mbas", "Mbouono"],
    Djiri: ["Kingouari", "Mantsimou", "Nkouikou", "Mabaya"],
  }

  for (const arr of arrondissements) {
    const districts = districtData[arr.name] || []
    for (const districtName of districts) {
      await prisma.district.create({
        data: {
          name: districtName,
          arrondissementId: arr.id,
        },
      })
    }
  }

  // 7. Create categories
  const categoryData = [
    { name: "Mode & Vêtements", icon: "shirt", description: "Vêtements, accessoires et articles de mode" },
    { name: "Chaussures", icon: "footprints", description: "Chaussures pour hommes, femmes et enfants" },
    { name: "Alimentation", icon: "apple", description: "Produits alimentaires et denrées" },
    { name: "Téléphones & Accessoires", icon: "smartphone", description: "Smartphones, tablettes et accessoires" },
    { name: "Électroménager", icon: "refrigerator", description: "Appareils électroménagers" },
    { name: "Beauté & Cosmétique", icon: "sparkles", description: "Produits de beauté et cosmétiques" },
    { name: "Restaurants", icon: "utensils-crossed", description: "Restaurants et services de restauration" },
    { name: "Supermarchés", icon: "shopping-cart", description: "Supermarchés et grandes surfaces" },
    { name: "Pharmacies", icon: "pill", description: "Pharmacies et produits de santé" },
    { name: "Meubles", icon: "armchair", description: "Meubles et articles de décoration" },
    { name: "Services", icon: "briefcase", description: "Services divers" },
    { name: "Automobile", icon: "car", description: "Véhicules et accessoires auto" },
    { name: "Immobilier", icon: "building", description: "Biens immobiliers" },
    { name: "Informatique", icon: "laptop", description: "Ordinateurs et équipements informatiques" },
    { name: "Enfants & Bébés", icon: "baby", description: "Articles pour enfants et bébés" },
    { name: "Sport & Loisirs", icon: "bike", description: "Articles de sport et loisirs" },
  ]

  const categories: Record<string, any> = {}
  for (let i = 0; i < categoryData.length; i++) {
    const cat = await prisma.category.create({
      data: {
        name: categoryData[i].name,
        slug: categoryData[i].name.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[&]/g, "et").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: categoryData[i].description,
        icon: categoryData[i].icon,
        displayOrder: i,
        status: true,
      },
    })
    categories[cat.name] = cat
  }

  // 8. Create subscription plans
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        name: "Gratuit",
        description: "Pour découvrir la plateforme",
        price: 0,
        durationDays: 365,
        promotionLimit: 5,
        featuredLimit: 0,
        analyticsLevel: "BASIC",
        supportLevel: "COMMUNITY",
        type: "FREE",
        status: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "Standard",
        description: "Pour les commerçants actifs",
        price: 15000,
        durationDays: 30,
        promotionLimit: 20,
        featuredLimit: 3,
        analyticsLevel: "ADVANCED",
        supportLevel: "PRIORITY",
        type: "STANDARD",
        status: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "Premium",
        description: "Pour maximiser la visibilité",
        price: 35000,
        durationDays: 30,
        promotionLimit: 999,
        featuredLimit: 10,
        analyticsLevel: "FULL",
        supportLevel: "DEDICATED",
        type: "PREMIUM",
        status: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "Enterprise",
        description: "Solution complète pour grandes enseignes",
        price: 75000,
        durationDays: 30,
        promotionLimit: 9999,
        featuredLimit: 999,
        analyticsLevel: "CUSTOM",
        supportLevel: "VIP",
        type: "ENTERPRISE",
        status: true,
      },
    }),
  ])

  // 9. Create demo shops
  const merchantPassword = await hash("Commercant@123", 12)
  const shopData = [
    {
      firstName: "Marie", lastName: "Ngombo",
      email: "marie@elegance.cg", phone: "+242055501001",
      shopName: "Boutique Élégance Brazzaville",
      desc: "Vêtements et accessoires de mode haut de gamme pour hommes et femmes. Découvrez notre collection de chemises, costumes, robes et accessoires tendance.",
      arrondissement: "Bacongo", district: "Mazda",
      category: "Mode & Vêtements",
      whatsapp: "+242055501001",
    },
    {
      firstName: "Jean", lastName: "Makaya",
      email: "jean@marketplus.cg", phone: "+242055501002",
      shopName: "Market Plus Moungali",
      description: "Supermarché proposant des produits alimentaires frais et variés. Viandes, légumes, produits importés et locaux à prix imbattables.",
      arrondissement: "Moungali", district: "Moukoukoulou",
      category: "Supermarchés",
      whatsapp: "+242055501002",
    },
    {
      firstName: "Paul", lastName: "Boungou",
      email: "paul@digitalstore.cg", phone: "+242055501003",
      shopName: "Digital Store Poto-Poto",
      description: "Spécialiste en smartphones, tablettes et accessoires informatiques. Toutes les grandes marques aux meilleurs prix.",
      arrondissement: "Poto-Poto", district: "Industriel",
      category: "Téléphones & Accessoires",
      whatsapp: "+242055501003",
    },
    {
      firstName: "Sandra", lastName: "Moukouri",
      email: "sandra@delices.cg", phone: "+242055501004",
      shopName: "Délices Express Bacongo",
      description: "Restaurant proposant des plats africains et internationaux. Cuisine raffinée, service rapide et cadre agréable.",
      arrondissement: "Bacongo", district: "Loulombo",
      category: "Restaurants",
      whatsapp: "+242055501004",
    },
    {
      firstName: "Dr", lastName: "Mpassi",
      email: "pharma@santetalangai.cg", phone: "+242055501005",
      shopName: "Pharma Santé Talangaï",
      description: "Pharmacie moderne avec large gamme de médicaments, produits de santé et de bien-être. Service de livraison disponible.",
      arrondissement: "Talangaï", district: "Mangengué",
      category: "Pharmacies",
      whatsapp: "+242055501005",
    },
    {
      firstName: "Alain", lastName: "Moussavou",
      email: "alain@confort.cg", phone: "+242055501006",
      shopName: "Maison Confort Mfilou",
      description: "Magasin de meubles, électroménager et décoration. Meubles design, canapés, lits, tables et appareils électroménagers.",
      arrondissement: "Mfilou", district: "Mambém",
      category: "Meubles",
      whatsapp: "+242055501006",
    },
  ]

  const shops: any[] = []
  for (const sd of shopData) {
    const user = await prisma.user.create({
      data: {
        firstName: sd.firstName, lastName: sd.lastName,
        email: sd.email, phone: sd.phone,
        passwordHash: merchantPassword,
        role: "MERCHANT", status: "ACTIVE",
        emailVerifiedAt: new Date(),
      },
    })

    const arr = arrondissements.find(a => a.name === sd.arrondissement)
    const cat = categories[sd.category]

    const shop = await prisma.shop.create({
      data: {
        ownerId: user.id,
        name: sd.shopName,
        slug: sd.shopName.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36).slice(-4),
        description: sd.description,
        address: `Quartier ${sd.district}, ${sd.arrondissement}`,
        arrondissementId: arr?.id || null,
        district: sd.district,
        phone: sd.phone,
        whatsapp: sd.whatsapp,
        email: sd.email,
        categoryId: cat?.id || null,
        verificationStatus: "VERIFIED",
        isVerified: true,
        isFeatured: sd.shopName.includes("Élégance") || sd.shopName.includes("Market"),
        status: "APPROVED",
        logo: null,
        banner: null,
        openingHours: {
          "Lundi": "08:00-18:00", "Mardi": "08:00-18:00",
          "Mercredi": "08:00-18:00", "Jeudi": "08:00-18:00",
          "Vendredi": "08:00-18:00", "Samedi": "09:00-15:00",
          "Dimanche": "Fermé",
        },
        latitude: arr?.latitude || null,
        longitude: arr?.longitude || null,
      },
    })

    // Add gallery images
    const galleryUrls = [
      `https://placehold.co/600x400/e2e8f0/94a3b8?text=${encodeURIComponent(sd.shopName.slice(0, 20))}+1`,
      `https://placehold.co/600x400/fef3c7/92400e?text=${encodeURIComponent(sd.shopName.slice(0, 20))}+2`,
      `https://placehold.co/600x400/dbeafe/1e40af?text=${encodeURIComponent(sd.shopName.slice(0, 20))}+3`,
    ]
    for (let i = 0; i < galleryUrls.length; i++) {
      await prisma.shopGalleryImage.create({
        data: {
          shopId: shop.id,
          url: galleryUrls[i],
          caption: `${sd.shopName} - Photo ${i + 1}`,
          displayOrder: i,
        },
      })
    }

    // Create free subscription
    await prisma.shopSubscription.create({
      data: {
        shopId: shop.id,
        subscriptionPlanId: plans[0].id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    })

    shops.push(shop)
  }

  // 10. Create demo promotions
  const promoData = [
    { shop: "Boutique Élégance Brazzaville", title: "Chemises homme -30%", desc: "Chemises homme de marque à prix réduit. Collection été 2026.", oldPrice: 45000, newPrice: 31500, cat: "Mode & Vêtements", days: 15 },
    { shop: "Boutique Élégance Brazzaville", title: "Robes femmes en soldes", desc: "Robes d'été et de soirée jusqu'à -40%. Profitez des soldes.", oldPrice: 85000, newPrice: 51000, cat: "Mode & Vêtements", days: 20 },
    { shop: "Digital Store Poto-Poto", title: "Smartphone Galaxy A54 128GB", desc: "Smartphone Samsung Galaxy A54 5G. Écran Super AMOLED 120Hz.", oldPrice: 450000, newPrice: 329000, cat: "Téléphones & Accessoires", days: 10 },
    { shop: "Digital Store Poto-Poto", title: "Pack accessoires smartphone", desc: "Kit complet : coque, film verre trempé, chargeur rapide et écouteurs.", oldPrice: 35000, newPrice: 19900, cat: "Téléphones & Accessoires", days: 25 },
    { shop: "Market Plus Moungali", title: "Panier familial économique", desc: "Riz 10kg + Huile 5L + Sucre 2kg + Pâtes 1kg + Tomate 1L + Lait 1L", oldPrice: 35000, newPrice: 25500, cat: "Alimentation", days: 7 },
    { shop: "Market Plus Moungali", title: "Pack poulet congelé 5kg", desc: "Poulet congelé de qualité supérieure. Idéal pour les familles.", oldPrice: 25000, newPrice: 18500, cat: "Alimentation", days: 12 },
    { shop: "Délices Express Bacongo", title: "Menu affaires -25%", desc: "Plat + Boisson + Dessert : menu complet à prix réduit.", oldPrice: 10000, newPrice: 7500, cat: "Restaurants", days: 30 },
    { shop: "Délices Express Bacongo", title: "Poulet braisé frites", desc: "Délicieux poulet braisé accompagné de frites croustillantes.", oldPrice: 6500, newPrice: 4500, cat: "Restaurants", days: 20 },
    { shop: "Maison Confort Mfilou", title: "Canapé 3 places cuir", desc: "Canapé en cuir véritable 3 places. Design moderne et confortable.", oldPrice: 850000, newPrice: 599000, cat: "Meubles", days: 14 },
    { shop: "Maison Confort Mfilou", title: "Réfrigérateur 280L -20%", desc: "Réfrigérateur 280L, classe A+, faible consommation.", oldPrice: 450000, newPrice: 360000, cat: "Électroménager", days: 10 },
    { shop: "Pharma Santé Talangaï", title: "Pack bien-être -15%", desc: "Vitamines, compléments alimentaires et produits naturels en promotion.", oldPrice: 25000, newPrice: 21250, cat: "Pharmacies", days: 20 },
    { shop: "Pharma Santé Talangaï", title: "Soins visage 40%", desc: "Crèmes et produits de soin pour le visage. Grandes marques à prix réduits.", oldPrice: 15000, newPrice: 9000, cat: "Pharmacies", days: 15 },
  ]

  for (const pd of promoData) {
    const shop = shops.find(s => s.name === pd.shop)
    const cat = categories[pd.cat]
    if (!shop || !cat) continue

    const slug = pd.title.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const startDate = new Date()
    const endDate = new Date(Date.now() + pd.days * 24 * 60 * 60 * 1000)
    const discount = Math.round(((pd.oldPrice - pd.newPrice) / pd.oldPrice) * 100)

    const promotion = await prisma.promotion.create({
      data: {
        shopId: shop.id,
        categoryId: cat.id,
        title: pd.title,
        slug: slug + "-" + Date.now().toString(36).substr(-4),
        description: pd.desc,
        oldPrice: pd.oldPrice,
        newPrice: pd.newPrice,
        discountPercentage: discount,
        stockQuantity: Math.floor(Math.random() * 100) + 10,
        startDate,
        endDate,
        status: "APPROVED",
        visibility: pd.shop.includes("Digital") || pd.shop.includes("Élégance") ? "FEATURED" : "NORMAL",
        viewsCount: Math.floor(Math.random() * 500) + 50,
        whatsappClicks: Math.floor(Math.random() * 50),
        phoneClicks: Math.floor(Math.random() * 30),
        favoritesCount: Math.floor(Math.random() * 100),
      },
    })
  }

  // 11. Create demo reviews
  const demoUsers = await prisma.user.findMany({ where: { role: "CLIENT" } })
  if (demoUsers.length === 0) {
    const clientUser = await prisma.user.create({
      data: {
        firstName: "Client",
        lastName: "Test",
        email: "client@test.cg",
        phone: "+242055501010",
        passwordHash: await hash("Client@123", 12),
        role: "CLIENT",
        status: "ACTIVE",
      },
    })
  }

  // 12. Create demo CMS pages
  await prisma.cmsPage.create({
    data: {
      title: "À propos",
      slug: "a-propos",
      content: `# À propos de Congo Soldes

Congo Soldes est la première plateforme congolaise dédiée aux promotions et bonnes affaires.

Notre mission est de connecter les commerçants locaux avec les consommateurs à travers des offres attractives et vérifiées.

Basés à Brazzaville, nous couvrons progressivement toutes les grandes villes du Congo.`,
      metaTitle: "À propos - Congo Soldes",
      metaDescription: "Découvrez Congo Soldes, la plateforme congolaise des promotions",
      status: "PUBLISHED",
    },
  })

  await prisma.cmsPage.create({
    data: {
      title: "Conditions d'utilisation",
      slug: "conditions-utilisation",
      content: `# Conditions d'utilisation

## 1. Acceptation des conditions
En utilisant Congo Soldes, vous acceptez les présentes conditions d'utilisation.

## 2. Utilisation de la plateforme
Congo Soldes est une plateforme de mise en relation entre commerçants et consommateurs.

## 3. Responsabilités
Les commerçants sont responsables de l'exactitude des informations publiées.`,
      status: "PUBLISHED",
    },
  })

  await prisma.cmsPage.create({
    data: {
      title: "Politique de confidentialité",
      slug: "confidentialite",
      content: `# Politique de confidentialité

## Données collectées
Nous collectons les informations que vous nous fournissez lors de la création de votre compte.

## Utilisation des données
Vos données sont utilisées pour améliorer votre expérience sur la plateforme.

## Protection
Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles.`,
      status: "PUBLISHED",
    },
  })

  await prisma.cmsPage.create({
    data: {
      title: "FAQ",
      slug: "faq",
      content: `# Foire aux questions

## Comment créer une boutique ?
Rendez-vous sur la page d'inscription et choisissez le profil commerçant.

## Combien coûte la plateforme ?
L'inscription est gratuite. Des formules payantes sont disponibles pour plus de fonctionnalités.

## Comment contacter un commerçant ?
Utilisez les boutons WhatsApp ou Appel sur la fiche promotion.`,
      status: "PUBLISHED",
    },
  })

  // 13. Create banners
  await prisma.banner.create({
    data: {
      title: "Promotions du moment",
      imageUrl: "/banners/promotions-banner.jpg",
      linkUrl: "/promotions",
      placement: "HOME_HERO",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    },
  })

  console.log("     Seed terminé avec succès !")
  console.log(`     - ${arrondissements.length} arrondissements`)
  console.log("     - 9 arrondissements + quartiers")
  console.log(`     - ${Object.keys(categories).length} catégories`)
  console.log(`     - ${shops.length} boutiques démo`)
  console.log("     - Promotions démo créées")
  console.log("     - 4 abonnements créés")
  console.log("")
  console.log("  Identifiants de test :")
  console.log("     Admin   : admin@congosoldes.cg / Admin@123")
  console.log("     Client  : client@test.cg / Client@123")
  console.log("     Boutique: marie@elegance.cg / Commercant@123")
  console.log("     Boutique: jean@marketplus.cg / Commercant@123")
  console.log("")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("Erreur seed:", e)
    await prisma.$disconnect()
    process.exit(1)
  })