import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <div className={cn(
          sizeClasses[size],
          "rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin"
        )}></div>
        <div className={cn(
          "absolute inset-0",
          sizeClasses[size],
          "rounded-full border-4 border-transparent border-r-purple-500 animate-spin-slow"
        )}></div>
      </div>
    </div>
  )
}