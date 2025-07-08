import { Suspense } from "react"
import JobDetailPage from "../../../job-detail-page"
import { getJob } from "@/lib/getJob"
import { getJobs } from "@/lib/getJobs"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import RidejobMediaSection from "@/components/ridejob-media-section"

interface BlogArticle {
  id: string
  title: string
  slug?: string
  eyecatch?: { url: string }
}

interface JobPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params
  const job = await getJob(id)

  // 関連求人: 同一市区町村があればそれを優先、なければ都道府県で取得
  const relatedJobsRaw = await getJobs({
    municipalityId: job.municipality?.id,
    prefectureId: job.municipality ? undefined : job.prefecture?.id,
    limit: 4,
  })
  const relatedJobs = relatedJobsRaw.filter((j) => j.id !== job.id).slice(0, 4)

  return (
    <>
      <SiteHeader />
      <Suspense fallback={<div>読み込み中...</div>}>
        <JobDetailPage job={job} relatedJobs={relatedJobs} />
      </Suspense>
      {/* News Section */}
      <RidejobMediaSection />
      <SiteFooter />
    </>
  )
}
