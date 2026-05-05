import type { JobCategory, Municipality, Prefecture, Tag } from "@/features/master/types"

/** 画像 */
export interface JobImage {
  url: string
  height?: number
  width?: number
}

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
  applyEmail?: string
}
