import { fetchDetail } from "./microcms/fetcher"
import type { JobDetail } from "./types"

export type GetJobOptions = {
  draftKey?: string
}

/** 単一の求人を ID で取得（depth=2 で参照情報も展開） */
export const getJob = async (jobId: string, options: GetJobOptions = {}): Promise<JobDetail> => {
  const queries: Record<string, string | number> = { depth: 2 }
  if (options.draftKey) queries.draftKey = options.draftKey
  return fetchDetail<JobDetail>({
    endpoint: "jobs",
    contentId: jobId,
    queries,
    context: "getJob",
  })
}
