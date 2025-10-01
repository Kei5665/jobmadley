import Link from "next/link"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import RidejobMediaSection from "@/components/ridejob-media-section"
import { getJob } from "@/lib/getJob"
import { getJobs } from "@/lib/getJobs"
import { withErrorHandling } from "@/lib/error-handling"
import { ErrorDisplay, NotFound } from "@/components/ui/error-display"
import JobBreadcrumb from "../../components/job-breadcrumb"
import JobImageCarousel from "../../components/job-image-carousel"
import JobTitleActions from "../../components/job-title-actions"
import JobDescription from "../../components/job-description"
import RelatedJobs from "../../components/related-jobs"
import { getMediaArticles } from "@/lib/getMediaArticles"

interface StandbyJobPageProps {
  params: Promise<{ id: string }>
}

export default async function StandbyJobPage({ params }: StandbyJobPageProps) {
  const { id } = await params

  try {
    const job = await withErrorHandling(
      () => getJob(id),
      "getJob"
    )

    if (!job) {
      return (
        <div className="min-h-screen bg-white">
          <SiteHeader />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <NotFound
              title="求人が見つかりません"
              message="お探しの求人は見つかりませんでした。求人が削除されたか、URLが間違っている可能性があります。"
              backLink="/search"
              backLinkText="求人一覧に戻る"
            />
          </div>
          <SiteFooter />
        </div>
      )
    }

    const applyUrl = `/apply/${job.id}?source=standby`

    const relatedJobsRaw = await withErrorHandling(
      () => getJobs({
        municipalityId: job.municipality?.id,
        prefectureId: job.municipality ? undefined : job.prefecture?.id,
        limit: 4,
      }),
      "getRelatedJobs"
    )
    const relatedJobs = relatedJobsRaw.filter((j) => j.id !== job.id).slice(0, 4)

    const { companyArticles, interviewArticles } = await withErrorHandling(
      () => getMediaArticles(),
      "getMediaArticles"
    )

    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />

        <JobBreadcrumb job={job} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <JobImageCarousel
                images={job.images}
                imageUrl={job.imageUrl}
                altText={job.jobName ?? job.title}
              />

              <JobTitleActions job={job} applyUrl={applyUrl} isStandby />

              <JobDescription job={job} />

              <RelatedJobs jobs={relatedJobs} title="類似求人" />
            </div>
          </div>
        </div>

        <RidejobMediaSection
          companyArticles={companyArticles}
          interviewArticles={interviewArticles}
        />

        <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 p-3">
          <Link href={applyUrl} className="block">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-base py-3">
              応募画面へ進む
            </Button>
          </Link>
        </div>
        <div className="h-20 sm:hidden" />

        <SiteFooter />
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay
            error={error}
            title="求人詳細の取得に失敗しました"
            onRetry={() => window.location.reload()}
          />
        </div>
        <SiteFooter />
      </div>
    )
  }
}

