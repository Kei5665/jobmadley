import { microcmsClient } from "./microcms"
import type { JobDetail } from "./types"

/**
 * 単一の求人を ID で取得
 * depth=2 で参照情報も含め取得
 */
export const getJob = async (jobId: string): Promise<JobDetail> => {
  const data = await microcmsClient.get<JobDetail>({
    endpoint: "jobs",
    contentId: jobId,
    queries: { depth: 2 },
  })

  return data
} 