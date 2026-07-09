"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Heart, Store, MessageSquare, Settings,
  LogOut, ShoppingBag, TrendingUp, CreditCard, Megaphone,
  Users, FileText, Bell, Star, MapPin
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icone: React.ReactNode
}

interface DashboardSidebarProps {
  type: "client" | "commercant" | "admin"
}

export function DashboardSidebar({ type }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navItems: Record<string, NavItem[]> = {
    client: [
      { label: "Tableau de bord", href: "/client/dashboard", icone: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Mes favoris", href: "/client/favoris", icone: <Heart className="h-4 w-4" /> },
      { label: "Boutiques suivies", href: "/client/boutiques-suivies", icone: <Store className="h-4 w-4" /> },
      { label: "Notifications", href: "/client/notifications", icone: <Bell className="h-4 w-4" /> },
      { label: "Paramètres", href: "/client/parametres", icone: <Settings className="h-4 w-4" /> },
    ],
    commercant: [
      { label: "Tableau de bord", href: "/commercant/dashboard", icone: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Mes promotions", href: "/commercant/promotions", icone: <TagIcon /> },
      { label: "Nouvelle promotion", href: "/commercant/promotions/nouvelle", icone: <FileText className="h-4 w-4" /> },
      { label: "Ma boutique", href: "/commercant/boutique", icone: <Store className="h-4 w-4" /> },
      { label: "Messages", href: "/commercant/messages", icone: <MessageSquare className="h-4 w-4" /> },
      { label: "Statistiques", href: "/commercant/statistiques", icone: <TrendingUp className="h-4 w-4" /> },
      { label: "Abonnement", href: "/commercant/abonnement", icone: <CreditCard className="h-4 w-4" /> },
      { label: "Paramètres", href: "/commercant/parametres", icone: <Settings className="h-4 w-4" /> },
    ],
    admin: [
      { label: "Tableau de bord", href: "/admin/dashboard", icone: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Utilisateurs", href: "/admin/utilisateurs", icone: <Users className="h-4 w-4" /> },
      { label: "Commerçants", href: "/admin/commercants", icone: <Store className="h-4 w-4" /> },
      { label: "Promotions", href: "/admin/promotions", icone: <TagIcon /> },
      { label: "Catégories", href: "/admin/categories", icone: <FileText className="h-4 w-4" /> },
      { label: "Villes", href: "/admin/villes", icone: <MapPin className="h-4 w-4" /> },
      { label: "Abonnements", href: "/admin/abonnements", icone: <CreditCard className="h-4 w-4" /> },
      { label: "Paiements", href: "/admin/paiements", icone: <CreditCard className="h-4 w-4" /> },
      { label: "Publicités", href: "/admin/publicites", icone: <Megaphone className="h-4 w-4" /> },
      { label: "Pages CMS", href: "/admin/cms", icone: <FileText className="h-4 w-4" /> },
      { label: "Bannières", href: "/admin/banners", icone: <Megaphone className="h-4 w-4" /> },
      { label: "Signalements", href: "/admin/signalements", icone: <Star className="h-4 w-4" /> },
      { label: "Paramètres", href: "/admin/parametres", icone: <Settings className="h-4 w-4" /> },
    ],
  }

  const items = navItems[type] || []

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white lg:block">
      <nav className="sticky top-16 p-4">
        <div className="mb-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {type === "admin" ? "Administration" : type === "commercant" ? "Mon Commerce" : "Mon Espace"}
          </p>
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary-50 text-primary-600 border-r-2 border-primary-500"
                  : "text-gray-600 hover:bg-amber-50 hover:text-primary-600"
              )}
            >
              {item.icone}
              {item.label}
            </Link>
          ))}
        </div>
        <hr className="my-4" />
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-primary-600"
        >
          <ShoppingBag className="h-4 w-4" />
          Retour au site
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </nav>
    </aside>
  )
}

function TagIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  )
}
