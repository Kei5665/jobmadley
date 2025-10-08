import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import JobBreadcrumb from "@/app/job/components/job-breadcrumb"
import JobImageCarousel from "@/app/job/components/job-image-carousel"
import JobTitleActions from "@/app/job/components/job-title-actions"
import JobDescription from "@/app/job/components/job-description"
import { getJob } from "@/lib/getJob"
import { AppError, ErrorType, withErrorHandling } from "@/lib/error-handling"

export const revalidate = 0

interface JobPreviewPageProps {
  params: { id: string }
  searchParams?: { draftKey?: string }
}

export default async function JobPreviewPage({ params, searchParams }: JobPreviewPageProps) {
  const { id } = params
  const draftKey = searchParams?.draftKey

  if (!draftKey) {
    notFound()
  }

  let job
  try {
    job = await withErrorHandling(
      () => getJob(id, { draftKey }),
      "getJobPreview"
    )
  } catch (error) {
    if (error instanceof AppError && error.type === ErrorType.NOT_FOUND) {
      notFound()
    }
    throw error
  }

  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 text-sm text-gray-600">
          プレビューモードで表示しています。
        </div>
      </div>

      <JobBreadcrumb job={job} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <JobImageCarousel
              images={job.images}
              imageUrl={job.imageUrl}
              altText={job.jobName ?? job.title}
            />

            <JobTitleActions job={job} showApplyButton={false} />

            <JobDescription job={job} />
          </div>
        </div>
      </div>

      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 p-3">
        <Link href={`/apply/${job.id}`} className="block">
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
