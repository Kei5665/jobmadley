import { fetchDetailOrNull, fetchList } from "@/shared/microcms/fetcher"
import type { JobCategory } from "./types"

/** 職種カテゴリ一覧を取得 */
export const getJobCategories = async (): Promise<JobCategory[]> => {
  const data = await fetchList<JobCategory>({
    endpoint: "jobcategories",
    queries: { limit: 100 },
    context: "getJobCategories",
  })
  return data.contents
}

/** 職種カテゴリを ID で取得（存在しなければ null） */
export const getJobCategoryById = async (jobCategoryId: string): Promise<JobCategory | null> =>
  fetchDetailOrNull<JobCategory>({
    endpoint: "jobcategories",
    contentId: jobCategoryId,
    context: "getJobCategoryById",
  })
