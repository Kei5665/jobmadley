import { microcmsClient } from "./microcms"
import type { Tag, MicroCMSListResponse } from "./types"

/**
 * タグ一覧を取得
 */
export const getTags = async (): Promise<Tag[]> => {
  try {
    const data = await microcmsClient.get<MicroCMSListResponse<Tag>>({
      endpoint: "tag",
      queries: { limit: 100 },
    })

    return data.contents
  } catch (error) {
    console.error("[microCMS:getTags] Failed to fetch tags", { error })
    throw error
  }
}
