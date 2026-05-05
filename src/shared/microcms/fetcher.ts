import type { MicroCMSQueries } from "microcms-js-sdk"
import { microcmsClient, microcmsClient2 } from "@/shared/microcms/client"
import type { MicroCMSListResponse } from "./types"

type ClientKey = "primary" | "media"

const clientFor = (key: ClientKey) => (key === "media" ? microcmsClient2 : microcmsClient)

const logFailure = (context: string, detail: Record<string, unknown>, error: unknown): void => {
  console.error(`[microCMS:${context}] ${detail.message ?? "request failed"}`, { ...detail, error })
}

export interface FetchListParams<TQueries extends MicroCMSQueries = MicroCMSQueries> {
  endpoint: string
  queries?: TQueries
  context: string
  client?: ClientKey
}

export const fetchList = async <T>({
  endpoint,
  queries,
  context,
  client = "primary",
}: FetchListParams): Promise<MicroCMSListResponse<T>> => {
  try {
    return await clientFor(client).get<MicroCMSListResponse<T>>({ endpoint, queries })
  } catch (error) {
    logFailure(context, { endpoint, queries }, error)
    throw error
  }
}

export interface FetchDetailParams<TQueries extends MicroCMSQueries = MicroCMSQueries> {
  endpoint: string
  contentId: string
  queries?: TQueries
  context: string
  client?: ClientKey
}

export const fetchDetail = async <T>({
  endpoint,
  contentId,
  queries,
  context,
  client = "primary",
}: FetchDetailParams): Promise<T> => {
  try {
    return await clientFor(client).get<T>({ endpoint, contentId, queries })
  } catch (error) {
    logFailure(context, { endpoint, contentId, queries }, error)
    throw error
  }
}

// 失敗時に null を返す詳細取得（IDで引いて存在しないこともある場合）
export const fetchDetailOrNull = async <T>(params: FetchDetailParams): Promise<T | null> => {
  try {
    return await fetchDetail<T>(params)
  } catch {
    return null
  }
}

// === 求人検索フィルタービルダー ===
// 重複していたフィルタ組み立てを集約

export interface JobFilterInput {
  prefectureId?: string
  municipalityId?: string
  tagIds?: string[]
  jobCategoryId?: string
}

export const buildJobFilters = ({
  prefectureId,
  municipalityId,
  tagIds = [],
  jobCategoryId,
}: JobFilterInput): string | undefined => {
  const parts: string[] = []
  if (prefectureId) parts.push(`prefecture[equals]${prefectureId}`)
  if (municipalityId) parts.push(`municipality[equals]${municipalityId}`)
  if (tagIds.length > 0) {
    tagIds.forEach((id) => parts.push(`tags[contains]${id}`))
  }
  if (jobCategoryId) parts.push(`jobCategory[equals]${jobCategoryId}`)
  return parts.length > 0 ? parts.join("[and]") : undefined
}
