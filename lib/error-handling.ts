// =====================
// エラーハンドリング関連
// =====================

/**
 * エラーメッセージの種類
 */
export enum ErrorType {
  NETWORK = "NETWORK",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION = "VALIDATION",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

/**
 * アプリケーションエラークラス
 */
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode?: number
  public readonly originalError?: Error

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message)
    this.name = "AppError"
    this.type = type
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

/**
 * エラーをユーザーフレンドリーなメッセージに変換
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "予期しないエラーが発生しました"
}

/**
 * エラーの種類を判定
 */
export const getErrorType = (error: unknown): ErrorType => {
  if (error instanceof AppError) {
    return error.type
  }

  if (error instanceof Error) {
    if (error.message.includes("fetch")) {
      return ErrorType.NETWORK
    }
    if (error.message.includes("404")) {
      return ErrorType.NOT_FOUND
    }
  }

  return ErrorType.UNKNOWN
}

/**
 * API呼び出しのエラーハンドリング
 */
export const handleApiError = (error: unknown, context: string): AppError => {
  console.error(`API Error in ${context}:`, error)

  if (error instanceof Response) {
    if (error.status === 404) {
      return new AppError(
        "要求されたデータが見つかりません",
        ErrorType.NOT_FOUND,
        404
      )
    }
    if (error.status >= 500) {
      return new AppError(
        "サーバーエラーが発生しました",
        ErrorType.SERVER,
        error.status
      )
    }
    return new AppError(
      "リクエストの処理中にエラーが発生しました",
      ErrorType.NETWORK,
      error.status
    )
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new AppError(
      "ネットワークエラーが発生しました",
      ErrorType.NETWORK
    )
  }

  return new AppError(
    getErrorMessage(error),
    getErrorType(error),
    undefined,
    error instanceof Error ? error : undefined
  )
}

/**
 * 非同期関数のエラーハンドリングラッパー
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  context: string
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    throw handleApiError(error, context)
  }
}

/**
 * デフォルトのエラーメッセージマップ
 */
export const DEFAULT_ERROR_MESSAGES = {
  [ErrorType.NETWORK]: "ネットワークエラーが発生しました。接続を確認してください。",
  [ErrorType.NOT_FOUND]: "要求されたデータが見つかりません。",
  [ErrorType.VALIDATION]: "入力内容に問題があります。",
  [ErrorType.SERVER]: "サーバーエラーが発生しました。しばらく待ってからお試しください。",
  [ErrorType.UNKNOWN]: "予期しないエラーが発生しました。",
} as const 