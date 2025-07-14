import { microcmsClient } from "./microcms"
import type { Prefecture, PrefectureGroup, MicroCMSListResponse } from "./types"

/**
 * 都道府県一覧を取得
 */
export const getPrefectures = async (): Promise<Prefecture[]> => {
  const data = await microcmsClient.get<MicroCMSListResponse<Prefecture>>({
    endpoint: "prefectures",
    queries: { limit: 100 },
  })

  return data.contents
}

/**
 * 都道府県を地方別にグループ化
 */
export const getPrefectureGroups = async (): Promise<PrefectureGroup> => {
  const prefectures = await getPrefectures()
  
  const groups: PrefectureGroup = {}
  
  prefectures.forEach((pref) => {
    const { area } = pref
    if (!groups[area]) {
      groups[area] = []
    }
    groups[area].push({
      id: pref.id,
      region: pref.region,
      area: pref.area,
    })
  })
  
  return groups
}

/**
 * 都道府県を ID で取得
 */
export const getPrefectureById = async (prefectureId: string): Promise<Prefecture | null> => {
  try {
    const data = await microcmsClient.get<Prefecture>({
      endpoint: "prefectures",
      contentId: prefectureId,
    })
    return data
  } catch (error) {
    console.error("Failed to fetch prefecture:", error)
    return null
  }
} 