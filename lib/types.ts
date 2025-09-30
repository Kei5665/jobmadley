// =====================
// 基本型定義
// =====================

/** 都道府県 */
export interface Prefecture {
  id: string
  region: string
  area: string
}

/** 市区町村 */
export interface Municipality {
  id: string
  name: string
  prefecture: Prefecture
}

/** タグ */
export interface Tag {
  id: string
  name: string
}

/** 職種カテゴリ */
export interface JobCategory {
  id: string
  name: string
  category?: string
}

/** 画像 */
export interface JobImage {
  url: string
  height?: number
  width?: number
}

// =====================
// 求人関連型定義
// =====================

/** 求人基本情報 */
export interface JobBase {
  id: string
  title: string
  jobName?: string
  companyName?: string
  prefecture?: Prefecture
  municipality?: Municipality
  imageUrl?: string
  images?: JobImage[]
  tags?: Tag[]
  jobCategory?: JobCategory
  salaryMin?: number
  salaryMax?: number
  employmentType?: string
  // microCMS メタデータ
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  revisedAt?: string
}

/** 求人一覧表示用 */
export interface Job extends JobBase {
  // 一覧表示に必要な最低限の情報
}

/** 求人詳細情報 */
export interface JobDetail extends JobBase {
  // 詳細表示に必要な追加情報
  catchCopy?: string
  addressZip?: string
  addressPrefMuni?: string
  addressLine?: string
  addressBuilding?: string
  wageType?: string
  workStyle?: string
  avgScheduledHour?: number
  socialInsurance?: string
  ssReason?: string
  salaryNote?: string
  descriptionAppeal?: string
  descriptionWork?: string
  descriptionPerson?: string
  descriptionBenefits?: string
  workHours?: string
  holidays?: string
  descriptionOther?: string
  access?: string
  dlNote?: string
}

// =====================
// ブログ関連型定義
// =====================

/** ブログ記事 */
export interface BlogArticle {
  id: string
  title: string
  slug?: string
  eyecatch?: { url: string }
  publishedAt?: string
  category?: { 
    id: string
    name: string
    slug: string
  }
  content?: string
  html?: string
  company?: string
}

/** ブログカテゴリ */
export interface BlogCategory {
  id: string
  name: string
  slug: string
}

// =====================
// API レスポンス型定義
// =====================

/** microCMS リストレスポンス */
export interface MicroCMSListResponse<T> {
  contents: T[]
  totalCount: number
  offset: number
  limit: number
}

/** ページネーション設定 */
export interface PaginationConfig {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

// =====================
// コンポーネント Props 型定義
// =====================

/** 求人カード Props */
export interface JobCardProps {
  job: Job
  horizontal?: boolean
}

/** 検索結果ページ Props */
export interface SearchResultsPageProps {
  prefectureId?: string
  municipalityId?: string
  tagIds?: string[]
  jobCategoryId?: string
  page?: number
}

/** 求人詳細ページ Props */
export interface JobDetailPageProps {
  job: JobDetail
  relatedJobs: Job[]
  articles?: BlogArticle[]
}

/** 応募フォームページ Props */
// =====================
// フォーム型定義
// =====================

/** 応募フォームデータ */
export interface ApplicationFormData {
  lastName: string
  firstName: string
  lastNameKana: string
  firstNameKana: string
  birthDate: string
  phone: string
  email: string
  companyName: string
  jobName: string
  jobUrl: string
  applicationSource: string
}

// =====================
// 都道府県グループ型定義
// =====================

export interface PrefectureGroup {
  [area: string]: Prefecture[]
}

// =====================
// ユーティリティ型定義
// =====================

/** 日付関連のユーティリティ */
export interface DateUtils {
  isNew: (date: string) => boolean
  formatDate: (date: string) => string
}

/** 給与表示用ユーティリティ */
export interface SalaryDisplayUtils {
  formatSalary: (min?: number, max?: number) => string
} 