import { microcmsClient } from "./microcms"

export type Municipality = {
  id: string
  name: string
  prefecture: { id: string; region: string }
}

export const getMunicipalitiesByPrefectureId = async (
  prefectureId: string,
): Promise<Municipality[]> => {
  const data = await microcmsClient.get<{ contents: Municipality[] }>({
    endpoint: "municipalities",
    queries: {
      filters: `prefecture[equals]${prefectureId}`,
      limit: 100,
    },
  })

  return data.contents
} 