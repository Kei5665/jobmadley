import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/metadata"
import { microcmsClient } from "@/lib/microcms"
import type { Job, MicroCMSListResponse } from "@/lib/types"

const JOB_PAGE_SIZE = 100

const getAllJobsForSitemap = async (): Promise<Job[]> => {
  try {
    const jobs: Job[] = []
    let offset = 0

    while (true) {
      const data = await microcmsClient.get<MicroCMSListResponse<Job>>({
        endpoint: "jobs",
        queries: {
          limit: JOB_PAGE_SIZE,
          offset,
          fields: "id,updatedAt,publishedAt",
        },
      })

      jobs.push(...data.contents)

      offset += data.limit
      if (offset >= data.totalCount) {
        break
      }
    }

    return jobs
  } catch (error) {
    console.error("[sitemap] Failed to fetch jobs for sitemap, static routes only", { error })
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]

  const jobs = await getAllJobsForSitemap()

  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/job/${job.id}`,
    lastModified: job.updatedAt ?? job.publishedAt ?? undefined,
    changeFrequency: "daily",
    priority: 0.7,
  }))

  return [...staticRoutes, ...jobRoutes]
}
