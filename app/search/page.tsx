import { Suspense } from "react"
import SearchResultsPage from "../../search-results-page"

interface SearchPageProps {
  searchParams: {
    prefecture?: string // prefecture ID
    municipality?: string // municipality ID optional
    tags?: string // カンマ区切りのタグ ID 文字列 (optional)
    jobCategory?: string // 職種 ID (optional)
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <SearchResultsPage
        prefectureId={searchParams.prefecture}
        municipalityId={searchParams.municipality}
        tagIds={searchParams.tags ? searchParams.tags.split(",") : undefined}
        jobCategoryId={searchParams.jobCategory}
      />
    </Suspense>
  )
}
