"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  endDate: Date | string
  className?: string
  onExpired?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(endDate: Date): TimeLeft {
  const difference = endDate.getTime() - Date.now()
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function CountdownTimer({ endDate, className, onExpired }: CountdownTimerProps) {
  const targetDate = useMemo(() => typeof endDate === "string" ? new Date(endDate) : endDate, [endDate])
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate)
      setTimeLeft(remaining)
      if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        clearInterval(timer)
        onExpired?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onExpired])

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <span className={cn("text-sm font-medium text-red-500", className)}>
        Expiré
      </span>
    )
  }

  return (
    <div className={cn("flex items-center gap-1 text-sm font-medium", className)}>
      <span className="text-gray-600">Se termine dans :</span>
      <span className="font-bold text-primary-600">
        {timeLeft.days > 0 && `${timeLeft.days}j `}
        {timeLeft.hours.toString().padStart(2, "0")}:
        {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}