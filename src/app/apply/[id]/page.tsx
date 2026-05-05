import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ApplicationForm from "@/features/application/components/application-form"
import { getJob } from "@/features/jobs/api"
import { AppError, ErrorType, withErrorHandling } from "@/shared/lib/error-handling"

interface ApplicationPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { id } = await params

  let job: Awaited<ReturnType<typeof getJob>>
  try {
    job = await withErrorHandling(
      () => getJob(id),
      "getJobForApply"
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
    <Suspense fallback={<div>読み込み中...</div>}>
      <ApplicationForm job={job} />
    </Suspense>
  )
}
