import { Suspense } from "react"
import ApplicationFormPage from "../../../application-form-page"

interface ApplicationPageProps {
  params: {
    id: string
  }
}

export default function ApplicationPage({ params }: ApplicationPageProps) {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ApplicationFormPage jobId={params.id} />
    </Suspense>
  )
}
