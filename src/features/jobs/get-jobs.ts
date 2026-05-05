import { buildJobFilters, fetchList } from "@/shared/microcms/fetcher"
import type { Job } from "./types"

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

const buildJobQueries = (
  params: GetJobsParams & { offset?: number; limit: number; depth?: number },
): Record<string, string | number> => {
  const { prefectureId, municipalityId, tagIds, jobCategoryId, keyword, limit, orders, offset, depth } = params
  const filters = buildJobFilters({ prefectureId, municipalityId, tagIds, jobCategoryId })
  const queries: Record<string, string | number> = { limit }
  if (depth !== undefined) queries.depth = depth
  if (offset !== undefined) queries.offset = offset
  if (keyword) queries.q = keyword
  if (orders) queries.orders = orders
  if (filters) queries.filters = filters
  return queries
}

/** 求人一覧を microCMS から取得 */
export const getJobs = async (params: GetJobsParams): Promise<Job[]> => {
  const { limit = 100 } = params
  const data = await fetchList<Job>({
    endpoint: "jobs",
    queries: buildJobQueries({ ...params, limit, depth: 1 }),
    context: "getJobs",
  })
  return data.contents
}

/** 求人数だけを取得（limit=0） */
export const getJobCount = async ({
  prefectureId,
  municipalityId,
  keyword,
}: Pick<GetJobsParams, "prefectureId" | "municipalityId" | "keyword">): Promise<number> => {
  const data = await fetchList<Job>({
    endpoint: "jobs",
    queries: buildJobQueries({ prefectureId, municipalityId, keyword, limit: 0 }),
    context: "getJobCount",
  })
  return data.totalCount
}

/** ページネーション用: limit と offset を指定して求人を取得 */
export const getJobsPaged = async (
  params: GetJobsParams & { offset?: number },
): Promise<{ contents: Job[]; totalCount: number }> => {
  const { limit = 10, offset = 0 } = params
  const data = await fetchList<Job>({
    endpoint: "jobs",
    queries: buildJobQueries({ ...params, limit, offset, depth: 1 }),
    context: "getJobsPaged",
  })
  return { contents: data.contents, totalCount: data.totalCount }
}
