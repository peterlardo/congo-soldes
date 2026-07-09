export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  role: string
  avatar?: string | null
  status: string
  createdAt: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ShopWithDetails {
  id: string
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  banner?: string | null
  address?: string | null
  district?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  website?: string | null
  isVerified: boolean
  isFeatured: boolean
  status: string
  rating?: number
  category?: {
    id: string
    name: string
    slug: string
    icon?: string | null
  } | null
  arrondissement?: {
    id: string
    name: string
    slug: string
  } | null
  openingHours?: Record<string, string>
  _count?: {
    promotions: number
    followers: number
    reviews: number
  }
}

export interface PromotionCard {
  id: string
  title: string
  slug: string
  description?: string | null
  oldPrice: number
  newPrice: number
  discountPercentage: number
  stockQuantity?: number | null
  startDate: string
  endDate: string
  status: string
  visibility: string
  viewsCount: number
  whatsappClicks: number
  phoneClicks: number
  favoritesCount: number
  isSponsored?: boolean
  shop?: {
    id: string
    name: string
    slug: string
    logo?: string | null
    address?: string | null
    isVerified: boolean
    isFeatured: boolean
    arrondissement?: { name: string; slug: string } | null
  } | null
  category?: {
    id: string
    name: string
    slug: string
    icon?: string | null
  } | null
  media?: { url: string; altText?: string | null }[]
  _count?: {
    favorites: number
  }
}

export interface ReviewData {
  id: string
  userId: string
  shopId: string
  rating: number
  serviceRating?: number | null
  qualityRating?: number | null
  priceRating?: number | null
  comment?: string | null
  createdAt: string
  user?: {
    firstName: string
    lastName: string
    avatar?: string | null
  }
}

export interface DashboardStats {
  totalPromotions: number
  activePromotions: number
  expiredPromotions: number
  totalViews: number
  whatsappClicks: number
  phoneClicks: number
  mapClicks: number
  totalFavorites: number
  followersCount: number
  engagementRate: number
  topPromotions: PromotionCard[]
  viewsHistory: { date: string; count: number }[]
}

export interface AdminDashboardStats {
  totalUsers: number
  totalShops: number
  pendingShops: number
  activePromotions: number
  expiredPromotions: number
  reportedPromotions: number
  totalRevenue: number
  activeSubscriptions: number
  activeCampaigns: number
  topCategories: { name: string; count: number }[]
  topArrondissements: { name: string; count: number }[]
  userGrowth: { date: string; count: number }[]
  promoGrowth: { date: string; count: number }[]
}

declare module "next-auth" {
  interface User {
    role: string
    avatar?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    avatar?: string
  }
}