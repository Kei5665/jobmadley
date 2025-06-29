import { Suspense } from "react"
import JobDetailPage from "../../../job-detail-page"
import { getJob } from "@/lib/getJob"
import { microcmsClient2 } from "@/lib/microcms"

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

  const articleData = await microcmsClient2.get<{ contents: BlogArticle[] }>({
    endpoint: "blogs",
    queries: { limit: 4, orders: "-publishedAt" },
  })
  const articles = articleData.contents

  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <JobDetailPage job={job} articles={articles} />
    </Suspense>
  )
}
