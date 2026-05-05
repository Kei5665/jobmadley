import { fetchDetailOrNull, fetchList } from "@/shared/microcms/fetcher"
import type { Prefecture, PrefectureGroup } from "./types"

/** 都道府県一覧を取得 */
export const getPrefectures = async (): Promise<Prefecture[]> => {
  const data = await fetchList<Prefecture>({
    endpoint: "prefectures",
    queries: { limit: 100 },
    context: "getPrefectures",
  })
  return data.contents
}

/** 都道府県を地方別にグループ化 */
export const getPrefectureGroups = async (): Promise<PrefectureGroup> => {
  const prefectures = await getPrefectures()
  const groups: PrefectureGroup = {}
  prefectures.forEach((pref) => {
    const { area } = pref
    if (!groups[area]) groups[area] = []
    groups[area].push({ id: pref.id, region: pref.region, area: pref.area })
  })
  return groups
}

/** 都道府県を ID で取得（存在しなければ null） */
export const getPrefectureById = async (prefectureId: string): Promise<Prefecture | null> =>
  fetchDetailOrNull<Prefecture>({
    endpoint: "prefectures",
    contentId: prefectureId,
    context: "getPrefectureById",
  })
