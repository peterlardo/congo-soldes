import { cn } from "@/lib/utils"

type StatusType = "ACTIVE" | "INACTIVE" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | "EXPIRED" | "DRAFT" | "ARCHIVED" | "EN_ATTENTE" | "VALIDE" | "EN_ATTENTE" | "COMPLETED" | "CANCELLED" | "PUBLISHED"

interface StatusBadgeProps {
  status: StatusType | string
  size?: "sm" | "md"
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  APPROVED: "bg-green-100 text-green-800",
  PUBLISHED: "bg-green-100 text-green-800",
  VALIDE: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  EN_ATTENTE: "bg-yellow-100 text-yellow-800",
  DRAFT: "bg-gray-100 text-gray-600",
  REJECTED: "bg-red-100 text-red-800",
  SUSPENDED: "bg-red-100 text-red-800",
  EXPIRED: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-orange-100 text-orange-800",
  ARCHIVED: "bg-purple-100 text-purple-800",
  VERIFIED: "bg-blue-100 text-blue-800",
  FEATURED: "bg-primary-100 text-primary-800",
  SPONSORED: "bg-secondary-100 text-secondary-800",
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  APPROVED: "Approuvé",
  PUBLISHED: "Publié",
  VALIDE: "Validé",
  COMPLETED: "Terminé",
  INACTIVE: "Inactif",
  PENDING: "En attente",
  EN_ATTENTE: "En attente",
  DRAFT: "Brouillon",
  REJECTED: "Refusé",
  SUSPENDED: "Suspendu",
  EXPIRED: "Expiré",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
  ARCHIVED: "Archivé",
  VERIFIED: "Vérifié",
  FEATURED: "Mis en avant",
  SPONSORED: "Sponsorisé",
}

export function StatusBadge({ status, size = "sm", className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
  const label = STATUS_LABELS[status] || status

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
      style,
      className,
    )}>
      {label}
    </span>
  )
}