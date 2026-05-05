import { fetchList } from "@/shared/microcms/fetcher"
import type { Tag } from "./types"

/** タグ一覧を取得 */
export const getTags = async (): Promise<Tag[]> => {
  const data = await fetchList<Tag>({
    endpoint: "tag",
    queries: { limit: 100 },
    context: "getTags",
  })
  return data.contents
}
