import { prisma } from "./prisma"

// Define permission constants
export const Permissions = {
  // User management
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_SUSPEND: "user:suspend",

  // Shop management
  SHOP_CREATE: "shop:create",
  SHOP_READ: "shop:read",
  SHOP_UPDATE: "shop:update",
  SHOP_DELETE: "shop:delete",
  SHOP_APPROVE: "shop:approve",
  SHOP_VERIFY: "shop:verify",

  // Promotion management
  PROMOTION_CREATE: "promotion:create",
  PROMOTION_READ: "promotion:read",
  PROMOTION_UPDATE: "promotion:update",
  PROMOTION_DELETE: "promotion:delete",
  PROMOTION_APPROVE: "promotion:approve",

  // Category management
  CATEGORY_CREATE: "category:create",
  CATEGORY_READ: "category:read",
  CATEGORY_UPDATE: "category:update",
  CATEGORY_DELETE: "category:delete",

  // Review management
  REVIEW_MODERATE: "review:moderate",

  // CMS management
  CMS_CREATE: "cms:create",
  CMS_READ: "cms:read",
  CMS_UPDATE: "cms:update",
  CMS_DELETE: "cms:delete",

  // Banner management
  BANNER_CREATE: "banner:create",
  BANNER_READ: "banner:read",
  BANNER_UPDATE: "banner:update",
  BANNER_DELETE: "banner:delete",

  // Analytics
  ANALYTICS_READ: "analytics:read",

  // Subscription / Payment
  SUBSCRIPTION_READ: "subscription:read",
  SUBSCRIPTION_UPDATE: "subscription:update",
  PAYMENT_READ: "payment:read",
  PAYMENT_VALIDATE: "payment:validate",

  // Reports
  REPORT_READ: "report:read",
  REPORT_RESOLVE: "report:resolve",

  // Admin
  ADMIN_ACCESS: "admin:access",
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",

  // Campaign
  CAMPAIGN_CREATE: "campaign:create",
  CAMPAIGN_APPROVE: "campaign:approve",
} as const

export type Permission = (typeof Permissions)[keyof typeof Permissions]

const roleCache = new Map<string, string[]>()

export async function getRolePermissions(roleName: string): Promise<string[]> {
  const cached = roleCache.get(roleName)
  if (cached) return cached

  try {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    })

    if (!role) return []
    const perms = role.permissions.map((rp) => rp.permission.name)
    roleCache.set(roleName, perms)
    return perms
  } catch {
    return []
  }
}

export function clearRoleCache() {
  roleCache.clear()
}

// Map older permission names to newer ones for backward compatibility
const PERMISSION_ALIASES: Record<string, string> = {
  manage_users: Permissions.USER_CREATE,
  manage_shops: Permissions.SHOP_CREATE,
  manage_promotions: Permissions.PROMOTION_CREATE,
  manage_categories: Permissions.CATEGORY_CREATE,
  manage_subscriptions: Permissions.SUBSCRIPTION_READ,
  manage_payments: Permissions.PAYMENT_READ,
  moderate_content: Permissions.REVIEW_MODERATE,
  view_analytics: Permissions.ANALYTICS_READ,
  manage_cms: Permissions.CMS_CREATE,
  manage_banners: Permissions.BANNER_CREATE,
  create_promotions: Permissions.PROMOTION_CREATE,
  view_own_stats: Permissions.ANALYTICS_READ,
  manage_own_shop: Permissions.SHOP_UPDATE,
}

export async function hasPermission(
  userRole: string,
  requiredPermission: string
): Promise<boolean> {
  if (userRole === "SUPER_ADMIN") return true

  const dbPerms = await getRolePermissions(userRole)
  const mapped = dbPerms.map((p) => PERMISSION_ALIASES[p] || p)
  if (mapped.includes(requiredPermission)) return true

  const staticPerms = ROLE_PERMISSIONS[userRole] || []
  return staticPerms.includes(requiredPermission)
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: Object.values(Permissions),
  ADMIN: [
    Permissions.USER_READ,
    Permissions.USER_UPDATE,
    Permissions.USER_SUSPEND,
    Permissions.SHOP_READ,
    Permissions.SHOP_UPDATE,
    Permissions.SHOP_APPROVE,
    Permissions.SHOP_VERIFY,
    Permissions.SHOP_DELETE,
    Permissions.PROMOTION_READ,
    Permissions.PROMOTION_UPDATE,
    Permissions.PROMOTION_APPROVE,
    Permissions.PROMOTION_DELETE,
    Permissions.CATEGORY_CREATE,
    Permissions.CATEGORY_READ,
    Permissions.CATEGORY_UPDATE,
    Permissions.CATEGORY_DELETE,
    Permissions.REVIEW_MODERATE,
    Permissions.CMS_CREATE,
    Permissions.CMS_READ,
    Permissions.CMS_UPDATE,
    Permissions.CMS_DELETE,
    Permissions.BANNER_CREATE,
    Permissions.BANNER_READ,
    Permissions.BANNER_UPDATE,
    Permissions.BANNER_DELETE,
    Permissions.ANALYTICS_READ,
    Permissions.SUBSCRIPTION_READ,
    Permissions.SUBSCRIPTION_UPDATE,
    Permissions.PAYMENT_READ,
    Permissions.PAYMENT_VALIDATE,
    Permissions.REPORT_READ,
    Permissions.REPORT_RESOLVE,
    Permissions.ADMIN_ACCESS,
    Permissions.SETTINGS_READ,
    Permissions.SETTINGS_UPDATE,
    Permissions.CAMPAIGN_APPROVE,
  ],
  MODERATOR: [
    Permissions.PROMOTION_READ,
    Permissions.PROMOTION_APPROVE,
    Permissions.REVIEW_MODERATE,
    Permissions.REPORT_READ,
    Permissions.REPORT_RESOLVE,
    Permissions.SHOP_READ,
    Permissions.ADMIN_ACCESS,
  ],
  MERCHANT: [
    Permissions.SHOP_CREATE,
    Permissions.SHOP_READ,
    Permissions.SHOP_UPDATE,
    Permissions.PROMOTION_CREATE,
    Permissions.PROMOTION_READ,
    Permissions.PROMOTION_UPDATE,
    Permissions.PROMOTION_DELETE,
    Permissions.ANALYTICS_READ,
    Permissions.SUBSCRIPTION_READ,
  ],
  SHOP_MANAGER: [
    Permissions.SHOP_READ,
    Permissions.SHOP_UPDATE,
    Permissions.PROMOTION_CREATE,
    Permissions.PROMOTION_READ,
    Permissions.PROMOTION_UPDATE,
    Permissions.PROMOTION_DELETE,
  ],
  CLIENT: [
    Permissions.PROMOTION_READ,
    Permissions.SHOP_READ,
    Permissions.REVIEW_MODERATE,
  ],
  VISITOR: [
    Permissions.PROMOTION_READ,
    Permissions.SHOP_READ,
  ],
}
