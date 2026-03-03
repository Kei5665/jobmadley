import { Suspense } from "react"
import { notFound } from "next/navigation"
import ApplicationFormPage from "@/components/application-form-page"
import { getJob } from "@/lib/getJob"
import { AppError, ErrorType, withErrorHandling } from "@/lib/error-handling"

interface ApplicationPageProps {
  params: Promise<{ id: string }>
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
      <ApplicationFormPage job={job} />
    </Suspense>
  )
}
