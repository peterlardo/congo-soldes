export const APP_NAME = "Congo Soldes"
export const APP_SLOGAN = "La qualité au petit prix"
export const APP_CITY = "Brazzaville"
export const APP_COUNTRY = "Congo"

export const ARRONDISSEMENTS = [
  "Makélékélé",
  "Bacongo",
  "Poto-Poto",
  "Moungali",
  "Ouenzé",
  "Talangaï",
  "Mfilou",
  "Madibou",
  "Djiri",
] as const

export const QUARTIERS: Record<string, string[]> = {
  Makélékélé: ["Mikélékélé", "Nkombo", "Mafouta", "Mobembo", "Mfilou Ngamaba"],
  Bacongo: ["Bacongo", "Mbounda", "Loulombo", "Mankondé"],
  PotoPoto: ["Poto-Poto", "Moukondo", "Mikélékélé", "Quartier Industriel"],
  Moungali: ["Moungali", "Mitendi", "Mayaba", "Dongola"],
  Ouenzé: ["Ouenzé", "Mongo-Mongo", "Makabandilou", "Ndouka"],
  Talangaï: ["Talangaï", "Ngamaba", "Mangengué", "Mambou"],
  Mfilou: ["Mfilou", "Ngamaba", "Mambou", "Ntara"],
  Madibou: ["Madibou", "Mantouala", "Mpila", "Mbas"],
  Djiri: ["Djiri", "Kingouari", "Mantsimou", "Nkouikou"],
}

export const CATEGORIES = [
  { name: "Mode & Vêtements", icon: "shirt" },
  { name: "Chaussures", icon: "footprints" },
  { name: "Alimentation", icon: "apple" },
  { name: "Téléphones & Accessoires", icon: "smartphone" },
  { name: "Électroménager", icon: "refrigerator" },
  { name: "Beauté & Cosmétique", icon: "sparkles" },
  { name: "Restaurants", icon: "utensils-crossed" },
  { name: "Supermarchés", icon: "shopping-cart" },
  { name: "Pharmacies", icon: "pill" },
  { name: "Meubles", icon: "armchair" },
  { name: "Services", icon: "briefcase" },
  { name: "Automobile", icon: "car" },
  { name: "Immobilier", icon: "building" },
  { name: "Informatique", icon: "laptop" },
  { name: "Enfants & Bébés", icon: "baby" },
  { name: "Sport & Loisirs", icon: "bike" },
]

export const SUBSCRIPTION_PLANS = [
  {
    type: "FREE",
    name: "Gratuit",
    price: 0,
    durationDays: 30,
    promotionLimit: 5,
    featuredLimit: 0,
    analyticsLevel: "BASIC",
    supportLevel: "COMMUNITY",
    features: [
      "5 promotions par mois",
      "Visibilité standard",
      "Statistiques basiques",
      "Badge gratuit",
    ],
  },
  {
    type: "STANDARD",
    name: "Standard",
    price: 15000,
    durationDays: 30,
    promotionLimit: 20,
    featuredLimit: 3,
    analyticsLevel: "ADVANCED",
    supportLevel: "PRIORITY",
    features: [
      "20 promotions par mois",
      "Meilleure visibilité",
      "Statistiques avancées",
      "Support prioritaire",
      "3 mises en avant",
    ],
  },
  {
    type: "PREMIUM",
    name: "Premium",
    price: 35000,
    durationDays: 30,
    promotionLimit: 999,
    featuredLimit: 10,
    analyticsLevel: "FULL",
    supportLevel: "DEDICATED",
    features: [
      "Promotions illimitées",
      "Boutique mise en avant",
      "Badge Premium vérifié",
      "Statistiques détaillées",
      "Campagnes sponsorisées incluses",
      "Support dédié",
    ],
  },
  {
    type: "ENTERPRISE",
    name: "Enterprise",
    price: 75000,
    durationDays: 30,
    promotionLimit: 9999,
    featuredLimit: 999,
    analyticsLevel: "CUSTOM",
    supportLevel: "VIP",
    features: [
      "Tout du Premium",
      "Gestion multi-boutiques",
      "Reporting avancé",
      "Accompagnement personnalisé",
      "API dédiée",
      "Support VIP 24/7",
    ],
  },
]

export const DEMO_SHOPS = [
  {
    name: "Boutique Élégance Brazzaville",
    description: "Vêtements et accessoires de mode haut de gamme pour hommes et femmes.",
    category: "Mode & Vêtements",
    arrondissement: "Bacongo",
    district: "Mazda",
  },
  {
    name: "Market Plus Moungali",
    description: "Supermarché proposant des produits alimentaires frais et variés.",
    category: "Supermarchés",
    arrondissement: "Moungali",
    district: "Moukoukoulou",
  },
  {
    name: "Digital Store Poto-Poto",
    description: "Spécialiste en smartphones, tablettes et accessoires informatiques.",
    category: "Téléphones & Accessoires",
    arrondissement: "Poto-Poto",
    district: "Industriel",
  },
  {
    name: "Délices Express Bacongo",
    description: "Restaurant proposant des plats africains et internationaux.",
    category: "Restaurants",
    arrondissement: "Bacongo",
    district: "Loulombo",
  },
  {
    name: "Pharma Santé Talangaï",
    description: "Pharmacie moderne avec large gamme de médicaments et produits de santé.",
    category: "Pharmacies",
    arrondissement: "Talangaï",
    district: "Mangengué",
  },
  {
    name: "Maison Confort Mfilou",
    description: "Magasin de meubles et d'électroménager.",
    category: "Meubles",
    arrondissement: "Mfilou",
    district: "Mambém",
  },
]

export const DEMO_PROMOTIONS = [
  { title: "Chemises homme -30%", discount: 30, category: "Mode & Vêtements", minPrice: 15000 },
  { title: "Smartphones Galaxy à prix réduit", discount: 25, category: "Téléphones & Accessoires", minPrice: 150000 },
  { title: "Paniers alimentaires", discount: 15, category: "Alimentation", minPrice: 25000 },
  { title: "Produits cosmétiques -40%", discount: 40, category: "Beauté & Cosmétique", minPrice: 5000 },
  { title: "Réfrigérateur -20%", discount: 20, category: "Électroménager", minPrice: 350000 },
  { title: "Menus restaurant à -25%", discount: 25, category: "Restaurants", minPrice: 5000 },
  { title: "Accessoires informatiques -35%", discount: 35, category: "Informatique", minPrice: 7500 },
  { title: "Articles scolaires -50%", discount: 50, category: "Enfants & Bébés", minPrice: 2000 },
]