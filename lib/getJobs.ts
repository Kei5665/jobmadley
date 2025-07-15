import { microcmsClient } from "./microcms"
import type { Job, MicroCMSListResponse } from "./types"

interface GetJobsParams {
  /** 都道府県 ID で絞り込み (optional) */
  prefectureId?: string
  /** 市区町村 ID で絞り込み (optional) */
  municipalityId?: string
  /** タグ ID 配列で絞り込み (optional, 複数可) */
  tagIds?: string[]
  /** 職種 ID で絞り込み (optional) */
  jobCategoryId?: string
  /** フリーワード検索 (optional) */
  keyword?: string
  /** 取得件数 (default: 100) */
  limit?: number
  /** 並び順 (microCMS orders 文字列, optional) */
  orders?: string
}

/**
 * 求人一覧を microCMS から取得
 *
 * filters には [and] で条件を結合する
 * microCMS の `limit` は 100 以下にする
 */
export const getJobs = async ({
  prefectureId,
  municipalityId,
  tagIds = [],
  jobCategoryId,
  keyword,
  limit = 100,
  orders
}: GetJobsParams): Promise<Job[]> => {
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

  const data = await microcmsClient.get<MicroCMSListResponse<Job>>({
    endpoint: "jobs",
    queries: {
      limit,
      depth: 1, // タグの名前も取得
      ...(keyword ? { q: keyword } : {}),
      ...(orders ? { orders } : {}),
      ...(filters ? { filters } : {}),
    },
  })

  return data.contents
}

/** 求人数だけを取得（limit=0） */
export const getJobCount = async ({ 
  prefectureId, 
  municipalityId,
  keyword 
}: { 
  prefectureId?: string; 
  municipalityId?: string;
  keyword?: string;
}): Promise<number> => {
  const filterParts: string[] = []
  if (prefectureId) filterParts.push(`prefecture[equals]${prefectureId}`)
  if (municipalityId) filterParts.push(`municipality[equals]${municipalityId}`)

  const filters = filterParts.join("[and]")

  const data = await microcmsClient.get<MicroCMSListResponse<Job>>({
    endpoint: "jobs",
    queries: {
      limit: 0, // 件数のみ取得
      ...(keyword ? { q: keyword } : {}),
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
  keyword,
  limit = 10,
  offset = 0,
  orders,
}: GetJobsParams & { offset?: number }): Promise<{
  contents: Job[]
  totalCount: number
}> => {
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

  const data = await microcmsClient.get<MicroCMSListResponse<Job>>({
    endpoint: "jobs",
    queries: {
      limit,
      offset,
      depth: 1,
      ...(keyword ? { q: keyword } : {}),
      ...(orders ? { orders } : {}),
      ...(filters ? { filters } : {}),
    },
  })

  return { contents: data.contents, totalCount: data.totalCount }
} 