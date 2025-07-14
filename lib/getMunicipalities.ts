import { microcmsClient } from "./microcms"
import type { Municipality, MicroCMSListResponse } from "./types"

/**
 * 市区町村一覧を取得
 */
export const getMunicipalities = async (prefectureId?: string): Promise<Municipality[]> => {
  const queries: any = { limit: 100 }
  
  if (prefectureId) {
    queries.filters = `prefecture[equals]${prefectureId}`
  }
  
  const data = await microcmsClient.get<MicroCMSListResponse<Municipality>>({
    endpoint: "municipalities",
    queries,
  })

  return data.contents
}

/**
 * 市区町村を ID で取得
 */
export const getMunicipalityById = async (municipalityId: string): Promise<Municipality | null> => {
  try {
    const data = await microcmsClient.get<Municipality>({
      endpoint: "municipalities",
      contentId: municipalityId,
    })
    return data
  } catch (error) {
    console.error("Failed to fetch municipality:", error)
    return null
  }
} 