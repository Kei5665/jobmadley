export type JobDetail = {
  id: string
  title: string
  /** 会社名 */
  companyName?: string
  /** 職種名 */
  jobName?: string
  /** キャッチコピー */
  catchCopy?: string
  /** 住所関連 */
  addressZip?: string
  addressPrefMuni?: string
  addressLine?: string
  addressBuilding?: string
  /** 雇用形態 */
  employmentType?: string
  /** 給与形態 */
  wageType?: string
  /** 最低給与 */
  salaryMin?: number
  /** 最高給与 */
  salaryMax?: number
  /** 勤務形態 */
  workStyle?: string
  /** 都道府県参照 */
  prefecture?: {
    id: string
    region: string
  }
  /** 市区町村参照 */
  municipality?: {
    id: string
    name: string
  }
  /** タグ */
  tags?: { id: string; name: string }[]
  /** 職種カテゴリ */
  jobCategory?: { id: string; name: string }
  /** 画像 */
  images?: { url: string; height?: number; width?: number }[]
  /** microCMS メタ */
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  revisedAt?: string
  /** アピールポイント */
  descriptionAppeal?: string
  /** 仕事内容詳細 */
  descriptionWork?: string
  /** 求める人材 */
  descriptionPerson?: string
  /** 平均所定労働時間 */
  avgScheduledHour?: number
  /** 社会保険 */
  socialInsurance?: string
  /** 社会保険適用差異など */
  ssReason?: string
  /** 給与備考 */
  salaryNote?: string
  /** 福利厚生備考 */
  descriptionBenefits?: string
  /** 勤務時間 */
  workHours?: string
  /** 休日 */
  holidays?: string
  /** その他備考 */
  descriptionOther?: string
  /** 通勤アクセス */
  access?: string
  /** 勤務地補足メモ */
  dlNote?: string
}

import { microcmsClient } from "./microcms"

/**
 * 単一の求人を ID で取得
 * depth=2 で参照情報も含め取得
 */
export const getJob = async (jobId: string): Promise<JobDetail> => {
  const data = await microcmsClient.get<JobDetail>({
    endpoint: "jobs",
    contentId: jobId,
    queries: { depth: 2 },
  })

  return data
} 