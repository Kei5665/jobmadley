import { Suspense } from "react"
import SearchResultsPage from "../../search-results-page"

interface SearchPageProps {
  searchParams: Promise<{
    prefecture?: string // prefecture ID
    municipality?: string // municipality ID optional
    tags?: string // カンマ区切りのタグ ID 文字列 (optional)
    jobCategory?: string // 職種 ID (optional)
    page?: string // ページ番号 (optional)
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const AnyComp = SearchResultsPage as any
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <AnyComp
        prefectureId={params.prefecture}
        municipalityId={params.municipality}
        tagIds={params.tags ? params.tags.split(",") : undefined}
        jobCategoryId={params.jobCategory}
        page={params.page ? Number(params.page) : undefined}
      />
    </Suspense>
  )
}
