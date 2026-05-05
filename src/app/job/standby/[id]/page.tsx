import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import RidejobMediaSection from "@/components/ridejob-media-section"
import { getJob } from "@/lib/getJob"
import { getJobs } from "@/lib/getJobs"
import { AppError, ErrorType, withErrorHandling } from "@/lib/error-handling"
import JobBreadcrumb from "../../components/job-breadcrumb"
import JobTitleActions from "../../components/job-title-actions"
import JobDescription from "../../components/job-description"
import RelatedJobs from "../../components/related-jobs"
import { getMediaArticles } from "@/lib/getMediaArticles"

interface StandbyJobPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function StandbyJobPage({ params }: StandbyJobPageProps) {
  const { id } = await params

  let job: Awaited<ReturnType<typeof getJob>>
  try {
    job = await withErrorHandling(() => getJob(id), "getJob")
  } catch (error) {
    if (error instanceof AppError && error.type === ErrorType.NOT_FOUND) {
      notFound()
    }
    throw error
  }

  if (!job) {
    notFound()
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
      <Script
        id="standby-landing"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){try{var t=new RegExp("[?&]stb_uid(=([^&#]*)|&|#|$)").exec(window.location.href);if(!t||!t[2])return;window.localStorage.setItem("stb_uid",t[2])}catch(t){}}();`
        }}
      />
      <SiteHeader />

      <JobBreadcrumb job={job} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <JobTitleActions job={job} applyUrl={applyUrl} />

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
}
