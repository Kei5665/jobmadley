import { microcmsClient } from "./microcms"

export type Prefecture = {
  id: string
  region: string
  area: string
}

export type PrefectureGroup = Record<string, { id: string; name: string }[]>

/**
 * microCMS から都道府県一覧を取得し、地方 (area) ごとに分類したオブジェクトを返す
 */
export const getPrefectureGroups = async (): Promise<PrefectureGroup> => {
  const data = await microcmsClient.get<{ contents: Prefecture[] }>({
    endpoint: "prefectures",
    queries: { limit: 100 },
  })

  const groups: PrefectureGroup = {}

  data.contents.forEach((pref) => {
    const area = pref.area || "その他"
    if (!groups[area]) {
      groups[area] = []
    }
    groups[area].push({ id: pref.id, name: pref.region })
  })

  return groups
}

/** 単一の都道府県を ID で取得 */
export const getPrefectureById = async (id: string): Promise<Prefecture | null> => {
  try {
    const data = await microcmsClient.get<Prefecture>({
      endpoint: "prefectures",
      contentId: id,
    })
    return data
  } catch (err) {
    console.error("Failed to fetch prefecture", err)
    return null
  }
} 