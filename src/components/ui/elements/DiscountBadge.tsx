import { cn } from "@/lib/utils"

interface DiscountBadgeProps {
  percentage: number
  size?: "sm" | "md" | "lg"
  className?: string
  showLabel?: boolean
}

export function DiscountBadge({ percentage, size = "md", className, showLabel = true }: DiscountBadgeProps) {
  if (percentage <= 0) return null

  return (
    <div className={cn(
      "inline-flex items-center justify-center rounded-lg bg-danger font-bold text-white shadow-lg",
      size === "sm" && "px-1.5 py-0.5 text-[10px]",
      size === "md" && "px-2.5 py-1 text-xs",
      size === "lg" && "px-3 py-1.5 text-sm",
      className,
    )}>
      -{percentage}%{showLabel && <span className="ml-0.5 font-normal">de réduction</span>}
    </div>
  )
}