import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loading({ message = "読み込み中...", size = "md", className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
  isVisible: boolean
}

export function LoadingOverlay({ message = "読み込み中...", isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <Loading message={message} />
      </div>
    </div>
  )
}

interface LoadingCardProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingCard({ title, description, className }: LoadingCardProps) {
  return (
    <div className={cn("bg-white border rounded-lg p-6 shadow-sm", className)}>
      <Loading message={title} />
      {description && (
        <p className="text-gray-600 text-sm mt-2 text-center">{description}</p>
      )}
    </div>
  )
}

interface LoadingButtonProps {
  children: React.ReactNode
  isLoading: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
}

export function LoadingButton({
  children,
  isLoading,
  disabled,
  className,
  onClick,
  type = "button",
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
        "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
} 