import { AlertTriangle, RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { ErrorType, getErrorMessage, getErrorType } from "@/lib/error-handling"

interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
  className?: string
  title?: string
  showRetryButton?: boolean
}

export function ErrorDisplay({
  error,
  onRetry,
  className,
  title,
  showRetryButton = true,
}: ErrorDisplayProps) {
  const errorMessage = getErrorMessage(error)
  const errorType = getErrorType(error)

  const getErrorIcon = () => {
    switch (errorType) {
      case ErrorType.NETWORK:
        return <AlertTriangle className="w-5 h-5" />
      case ErrorType.NOT_FOUND:
        return <XCircle className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getErrorVariant = () => {
    switch (errorType) {
      case ErrorType.NETWORK:
        return "default"
      case ErrorType.SERVER:
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Alert variant={getErrorVariant()} className={cn("", className)}>
      {getErrorIcon()}
      <AlertTitle>{title || "エラーが発生しました"}</AlertTitle>
      <AlertDescription className="mt-2">
        {errorMessage}
        {showRetryButton && onRetry && (
          <div className="mt-4">
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              再試行
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

interface ErrorBoundaryFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorDisplay
          error={error}
          onRetry={resetErrorBoundary}
          title="アプリケーションエラー"
          className="bg-white shadow-lg"
        />
      </div>
    </div>
  )
}

interface ErrorCardProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorCard({
  title = "エラーが発生しました",
  message = "データの読み込みに失敗しました",
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <div className={cn("bg-white border rounded-lg p-6 shadow-sm", className)}>
      <div className="flex items-center justify-center mb-4">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-4">{message}</p>
      {onRetry && (
        <div className="text-center">
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            再試行
          </Button>
        </div>
      )}
    </div>
  )
}

interface NotFoundProps {
  title?: string
  message?: string
  backLink?: string
  backLinkText?: string
  className?: string
}

export function NotFound({
  title = "ページが見つかりません",
  message = "お探しのページは見つかりませんでした",
  backLink = "/",
  backLinkText = "トップページに戻る",
  className,
}: NotFoundProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-8">{message}</p>
      <Button asChild>
        <a href={backLink}>{backLinkText}</a>
      </Button>
    </div>
  )
} 