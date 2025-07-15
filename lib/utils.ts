import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =====================
// 給与表示関連
// =====================

/**
 * 給与情報を整形して表示用文字列を生成
 */
export const formatSalary = (min?: number, max?: number): string => {
  if (min && max) {
    return `月給 ${min.toLocaleString()}円 ~ ${max.toLocaleString()}円`
  }
  if (min) {
    return `月給 ${min.toLocaleString()}円〜`
  }
  if (max) {
    return `月給 〜${max.toLocaleString()}円`
  }
  return "給与情報なし"
}

// =====================
// 日付処理関連
// =====================

/**
 * 公開日から新着かどうかを判定 (7日以内)
 */
export const isNew = (publishedDate?: string, createdDate?: string): boolean => {
  const dateStr = publishedDate ?? createdDate
  if (!dateStr) return false
  
  const date = new Date(dateStr)
  const now = Date.now()
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
  
  return date.getTime() > sevenDaysAgo
}

/**
 * 日付を日本語形式で表示
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  })
}

// =====================
// 住所表示関連
// =====================

/**
 * 都道府県と市区町村を結合して表示用文字列を生成
 */
export const formatAddress = (
  municipalityName?: string,
  prefectureName?: string
): string => {
  return [municipalityName, prefectureName].filter(Boolean).join(" ")
}

// =====================
// 画像処理関連
// =====================

/**
 * 求人画像URLを取得（フォールバック付き）
 */
export const getJobImageUrl = (
  images?: { url: string }[],
  imageUrl?: string
): string => {
  return images?.[0]?.url ?? imageUrl ?? "/placeholder.svg"
}

// =====================
// URL生成関連
// =====================

/**
 * 検索パラメータからクエリ文字列を生成
 */
export const buildSearchQuery = (params: {
  prefectureId?: string
  municipalityId?: string
  tagIds?: string[]
  jobCategoryId?: string
  keyword?: string
  page?: number
}): string => {
  const searchParams = new URLSearchParams()
  
  if (params.keyword?.trim()) {
    searchParams.set("q", params.keyword.trim())
  }
  if (params.prefectureId) {
    searchParams.set("prefecture", params.prefectureId)
  }
  if (params.municipalityId) {
    searchParams.set("municipality", params.municipalityId)
  }
  if (params.tagIds?.length) {
    searchParams.set("tags", params.tagIds.join(","))
  }
  if (params.jobCategoryId) {
    searchParams.set("jobCategory", params.jobCategoryId)
  }
  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page))
  }
  
  return searchParams.toString()
}

// =====================
// バリデーション関連
// =====================

/**
 * メールアドレスの形式チェック
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 電話番号の形式チェック（日本の電話番号）
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ""))
}
