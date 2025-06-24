import { microcmsClient } from "./microcms"

export type JobCategory = {
  id: string
  name: string
  /** 職種カテゴリ (大分類) */
  category?: string
}

/**
 * 職種 (job categories) を取得
 */
export const getJobCategories = async (): Promise<JobCategory[]> => {
  const data = await microcmsClient.get<{ contents: JobCategory[] }>({
    endpoint: "jobcategories",
    queries: {
      limit: 100,
    },
  })

  return data.contents
} 