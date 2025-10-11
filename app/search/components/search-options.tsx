"use client"

import MunicipalityDialog from "../../../components/municipality-dialog"
import PrefectureDialog from "@/components/prefecture-dialog"
import type { PrefectureGroup } from "@/lib/types"
import TagDialog from "@/components/tags-dialog"
import JobCategoryDialog from "@/components/job-category-dialog"
import type { Tag, JobCategory } from "@/lib/types"
import KeywordInput from "./keyword-input"

interface SearchOptionsProps {
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

export default function SearchOptions({
  keyword,
  prefectureId,
  prefectureName,
  municipalityId,
  jobCategories,
  jobCategoryId,
  tags,
  tagIds,
  prefectureGroups,
}: SearchOptionsProps) {
  return (
    <>
      {/* フリーワード検索 */}
      <KeywordInput
        keyword={keyword}
        prefectureId={prefectureId}
        municipalityId={municipalityId}
        tagIds={tagIds}
        jobCategoryId={jobCategoryId}
      />

      {/* Search Options */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* 都道府県 */}
        {prefectureGroups && (
          <PrefectureDialog
            groups={prefectureGroups}
            keyword={keyword}
            jobCategoryId={jobCategoryId}
            tagIds={tagIds}
          />
        )}

        {/* 市区町村（都道府県が選択されているときのみ） */}
        {prefectureId && (
          <MunicipalityDialog
            prefectureId={prefectureId}
            prefectureName={prefectureName}
            keyword={keyword}
          />
        )}
        <JobCategoryDialog
          jobCategories={jobCategories}
          selectedJobCategoryId={jobCategoryId}
          keyword={keyword}
          prefectureId={prefectureId}
          municipalityId={municipalityId}
        />

        {/* 特徴（タグ） */}
        <TagDialog
          tags={tags}
          selectedTagIds={tagIds}
          keyword={keyword}
          prefectureId={prefectureId}
          municipalityId={municipalityId}
        />
      </div>
    </>
  )
} 