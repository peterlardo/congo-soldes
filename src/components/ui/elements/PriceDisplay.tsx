import { formatPrix } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  oldPrice: number
  newPrice: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PriceDisplay({ oldPrice, newPrice, size = "md", className }: PriceDisplayProps) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn(
        "font-bold text-primary-500",
        size === "sm" && "text-base",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl",
      )}>
        {formatPrix(newPrice)}
      </span>
      <span className={cn(
        "text-gray-400 line-through",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base",
      )}>
        {formatPrix(oldPrice)}
      </span>
    </div>
  )
}