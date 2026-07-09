import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  count?: number
  className?: string
}

export function RatingStars({ rating, maxRating = 5, size = "md", showValue = true, count, className }: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(
              "fill-yellow-400 text-yellow-400",
              size === "sm" && "h-3 w-3",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5",
            )}
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            className={cn(
              "fill-yellow-400 text-yellow-400",
              size === "sm" && "h-3 w-3",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5",
            )}
          />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(
              "text-gray-300",
              size === "sm" && "h-3 w-3",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5",
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn(
          "font-medium text-gray-600",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
        )}>
          {rating.toFixed(1)}
          {count !== undefined && count !== null && (
            <span className="ml-1 font-normal text-gray-400">({count})</span>
          )}
        </span>
      )}
    </div>
  )
}