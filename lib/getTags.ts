import { microcmsClient } from "./microcms"

export type Tag = {
  id: string
  name: string
}

/**
 * タグ一覧を microCMS から取得
 */
export const getTags = async (): Promise<Tag[]> => {
  const data = await microcmsClient.get<{ contents: Tag[] }>({
    endpoint: "tag", // microCMS 側のエンドポイント名（単数）
    queries: {
      limit: 100,
    },
  })

  return data.contents
}
