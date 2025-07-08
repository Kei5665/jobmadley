import { microcmsClient } from "./microcms"

export type Job = {
  id: string
  title: string
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
  /** 任意のサムネイル URL */
  imageUrl?: string
  /** 複数画像 */
  images?: {
    url: string
  }[]
  /** タグ参照 (複数) */
  tags?: {
    id: string
    name: string
  }[]
  /** 職種名 */
  jobName?: string
  /** 最低給与 */
  salaryMin?: number
  /** 最高給与 */
  salaryMax?: number
  // 必要であれば今後フィールドを追加
}

interface GetJobsParams {
  /** 都道府県 ID で絞り込み (optional) */
  prefectureId?: string
  /** 市区町村 ID で絞り込み (optional) */
  municipalityId?: string
  /** タグ ID 配列で絞り込み (optional, 複数可) */
  tagIds?: string[]
  /** 職種 ID で絞り込み (optional) */
  jobCategoryId?: string
  /** 取得件数 (default: 100) */
  limit?: number
}

/**
 * 求人一覧を microCMS から取得
 *
 * filters には [and] で条件を結合する[[memory:7889397435779635015]]
 * microCMS の `limit` は 100 以下にする[[memory:1588031229221905914]]
 */
export const getJobs = async ({ prefectureId, municipalityId, tagIds = [], jobCategoryId, limit = 100 }: GetJobsParams) => {
  const filterParts: string[] = []
  if (prefectureId) filterParts.push(`prefecture[equals]${prefectureId}`)
  if (municipalityId) filterParts.push(`municipality[equals]${municipalityId}`)
  if (tagIds.length > 0) {
    tagIds.forEach((id) => {
      filterParts.push(`tags[contains]${id}`)
    })
  }
  if (jobCategoryId) filterParts.push(`jobcategory[equals]${jobCategoryId}`)

  const filters = filterParts.join("[and]")

  const data = await microcmsClient.get<{ contents: Job[] }>({
    endpoint: "jobs",
    queries: {
      limit,
      depth: 1, // タグの名前も取得
      ...(filters ? { filters } : {}),
    },
  })

  return data.contents
}

/** 求人数だけを取得（limit=0） */
export const getJobCount = async ({ prefectureId, municipalityId }: { prefectureId?: string; municipalityId?: string }) => {
  const filterParts: string[] = []
  if (prefectureId) filterParts.push(`prefecture[equals]${prefectureId}`)
  if (municipalityId) filterParts.push(`municipality[equals]${municipalityId}`)

  const filters = filterParts.join("[and]")

  const data = await microcmsClient.get<{ totalCount: number }>({
    endpoint: "jobs",
    queries: {
      limit: 0, // 件数のみ取得
      ...(filters ? { filters } : {}),
    },
  })

  return data.totalCount
}

/**
 * ページネーション用: limit と offset を指定して求人を取得
 * microCMS の totalCount を併せて返す
 */
export const getJobsPaged = async ({
  prefectureId,
  municipalityId,
  tagIds = [],
  jobCategoryId,
  limit = 10,
  offset = 0,
}: GetJobsParams & { offset?: number }) => {
  const filterParts: string[] = []
  if (prefectureId) filterParts.push(`prefecture[equals]${prefectureId}`)
  if (municipalityId) filterParts.push(`municipality[equals]${municipalityId}`)
  if (tagIds.length > 0) {
    tagIds.forEach((id) => {
      filterParts.push(`tags[contains]${id}`)
    })
  }
  if (jobCategoryId) filterParts.push(`jobcategory[equals]${jobCategoryId}`)

  const filters = filterParts.join("[and]")

  const data = await microcmsClient.get<{ contents: Job[]; totalCount: number }>({
    endpoint: "jobs",
    queries: {
      limit,
      offset,
      depth: 1,
      ...(filters ? { filters } : {}),
    },
  })

  return { contents: data.contents, totalCount: data.totalCount }
} 