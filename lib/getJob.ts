import { microcmsClient } from "./microcms"
import type { JobDetail } from "./types"

export type GetJobOptions = {
  draftKey?: string
}

/**
 * 単一の求人を ID で取得
 * depth=2 で参照情報も含め取得
 */
export const getJob = async (
  jobId: string,
  options: GetJobOptions = {}
): Promise<JobDetail> => {
  const data = await microcmsClient.get<JobDetail>({
    endpoint: "jobs",
    contentId: jobId,
    queries: {
      depth: 2,
      ...(options.draftKey ? { draftKey: options.draftKey } : {}),
    },
  })

  return data
}