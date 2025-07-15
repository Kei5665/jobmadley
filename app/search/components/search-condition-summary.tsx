import type { Tag, JobCategory, Municipality } from "@/lib/types"

interface SearchConditionSummaryProps {
  keyword?: string
  prefectureName: string
  selectedMunicipality: Municipality | null
  jobCategoryName: string
  tags: Tag[]
  tagIds: string[]
  jobCategories: JobCategory[]
  jobCategoryId?: string
}

export default function SearchConditionSummary({
  keyword,
  prefectureName,
  selectedMunicipality,
  jobCategoryName,
  tags,
  tagIds,
  jobCategories,
  jobCategoryId,
}: SearchConditionSummaryProps) {
  const tagNames = tags
    .filter((t) => tagIds.includes(t.id))
    .map((t) => t.name)
    
  const currentJobCategoryName = jobCategoryId
    ? jobCategories.find((c) => c.id === jobCategoryId)?.name
    : jobCategoryName

  const parts: string[] = []
  if (keyword) parts.push(`「${keyword}」`)
  parts.push(prefectureName)
  if (selectedMunicipality) parts.push(selectedMunicipality.name)
  if (currentJobCategoryName) parts.push(currentJobCategoryName)
  if (tagNames.length) parts.push(tagNames.join(", "))

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">検索条件</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        {parts.join(" / ")} の求人を表示中
      </p>
    </div>
  )
} 