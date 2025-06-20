import { Suspense } from "react"
import JobDetailPage from "../../../job-detail-page"

interface JobPageProps {
  params: {
    id: string
  }
}

export default function JobPage({ params }: JobPageProps) {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <JobDetailPage jobId={params.id} />
    </Suspense>
  )
}
