import { microcmsClient } from "./microcms"

export type Municipality = {
  id: string
  name: string
  prefecture: string // reference id
}

export const getMunicipalitiesByPrefecture = async (
  prefectureId: string,
): Promise<Municipality[]> => {
  if (!prefectureId) return []

  const data = await microcmsClient.get<{ contents: Municipality[] }>({
    endpoint: "municipalities",
    queries: {
      limit: 200,
      filters: `prefecture[equals]${prefectureId}`,
    },
  })

  return data.contents
} 