import { microcmsClient } from "./microcms"
import type { JobCategory, MicroCMSListResponse } from "./types"

/**
 * 職種カテゴリ一覧を取得
 */
export const getJobCategories = async (): Promise<JobCategory[]> => {
  const data = await microcmsClient.get<MicroCMSListResponse<JobCategory>>({
    endpoint: "jobcategories",
    queries: { limit: 100 },
  })

  return data.contents
}

/**
 * 職種カテゴリを ID で取得
 */
export const getJobCategoryById = async (jobCategoryId: string): Promise<JobCategory | null> => {
  try {
    const data = await microcmsClient.get<JobCategory>({
      endpoint: "jobcategories",
      contentId: jobCategoryId,
    })
    return data
  } catch (error) {
    console.error("Failed to fetch job category:", error)
    return null
  }
} 