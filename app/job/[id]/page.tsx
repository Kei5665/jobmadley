import { Suspense } from "react"
import JobDetailPage from "../../../job-detail-page"
import { getJob } from "@/lib/getJob"

interface JobPageProps {
  params: {
    id: string
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await getJob(params.id)

  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <JobDetailPage job={job} />
    </Suspense>
  )
}
