"use client"

import { useRouter } from "next/navigation"
import SearchOptions from "./search-options"
import type { Tag, JobCategory, PrefectureGroup } from "@/lib/types"

interface FilterSidebarProps {
  keyword?: string
  prefectureId?: string
  prefectureName: string
  municipalityId?: string
  jobCategories: JobCategory[]
  jobCategoryId?: string
  tags: Tag[]
  tagIds: string[]
  prefectureGroups?: PrefectureGroup
}

export default function FilterSidebar(props: FilterSidebarProps) {
  const router = useRouter()

  const reset = () => {
    router.push("/search")
  }

  return (
    <aside className="bg-white border rounded-md p-4 md:sticky md:top-6 h-fit">
      <h2 className="text-base font-semibold text-gray-800 mb-3">検索</h2>
      <SearchOptions {...props} />
      <button
        onClick={reset}
        className="w-full mt-2 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
      >
        リセット
      </button>
    </aside>
  )
}


