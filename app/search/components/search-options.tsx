import MunicipalityDialog from "../../../components/municipality-dialog"
import TagDialog from "@/components/tags-dialog"
import JobCategoryDialog from "@/components/job-category-dialog"
import type { Tag, JobCategory } from "@/lib/types"

interface SearchOptionsProps {
  prefectureId?: string
  prefectureName: string
  municipalityId?: string
  jobCategories: JobCategory[]
  jobCategoryId?: string
  tags: Tag[]
  tagIds: string[]
}

export default function SearchOptions({
  prefectureId,
  prefectureName,
  municipalityId,
  jobCategories,
  jobCategoryId,
  tags,
  tagIds,
}: SearchOptionsProps) {
  return (
    <>
      {/* Search Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {prefectureId && (
          <MunicipalityDialog
            prefectureId={prefectureId}
            prefectureName={prefectureName}
          />
        )}
        <JobCategoryDialog
          jobCategories={jobCategories}
          selectedJobCategoryId={jobCategoryId}
          prefectureId={prefectureId}
          municipalityId={municipalityId}
        />
      </div>

      <div className="space-y-4 mb-8">
        <TagDialog
          tags={tags}
          selectedTagIds={tagIds}
          prefectureId={prefectureId}
          municipalityId={municipalityId}
        />
      </div>
    </>
  )
} 