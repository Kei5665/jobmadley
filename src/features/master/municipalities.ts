import { fetchDetailOrNull, fetchList } from "@/shared/microcms/fetcher"
import type { Municipality } from "./types"

/** 市区町村一覧を取得 */
export const getMunicipalities = async (prefectureId?: string): Promise<Municipality[]> => {
  const queries: Record<string, string | number> = { limit: 100 }
  if (prefectureId) queries.filters = `prefecture[equals]${prefectureId}`
  const data = await fetchList<Municipality>({
    endpoint: "municipalities",
    queries,
    context: "getMunicipalities",
  })
  return data.contents
}

/** 市区町村を ID で取得（存在しなければ null） */
export const getMunicipalityById = async (municipalityId: string): Promise<Municipality | null> =>
  fetchDetailOrNull<Municipality>({
    endpoint: "municipalities",
    contentId: municipalityId,
    context: "getMunicipalityById",
  })
