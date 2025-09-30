import { Suspense } from "react"
import ApplicationFormPage from "@/components/application-form-page"
import { getJob } from "@/lib/getJob"

interface ApplicationPageProps {
  params: { id: string }
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { id } = params
  const job = await getJob(id)
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ApplicationFormPage job={job} />
    </Suspense>
  )
}
