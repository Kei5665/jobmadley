import { Suspense } from "react"
import SearchResultsPage from "../../search-results-page"

interface SearchPageProps {
  searchParams: {
    prefecture?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <SearchResultsPage prefecture={searchParams.prefecture} />
    </Suspense>
  )
}
