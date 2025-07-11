import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import RidejobMediaSection from "@/components/ridejob-media-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Home, ChevronLeft } from "lucide-react"
import { getPrefectureById } from "@/lib/getPrefectures"
import { getJobsPaged } from "@/lib/getJobs"
import { microcmsClient } from "@/lib/microcms"
import type { Municipality } from "@/lib/getMunicipalities"
import { getTags } from "@/lib/getTags"
import { getJobCategories } from "@/lib/getJobCategories"
import MunicipalityDialog from "./components/municipality-dialog"
import TagDialog from "@/components/tags-dialog"
import JobCategoryDialog from "@/components/job-category-dialog"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"
import JobCard from "@/components/job-card"

interface SearchResultsPageProps {
  prefectureId?: string
  municipalityId?: string
  tagIds?: string[]
  jobCategoryId?: string
  page?: number
}

export default async function SearchResultsPage({ prefectureId, municipalityId, tagIds = [], jobCategoryId, page = 1 }: SearchResultsPageProps) {
  const prefectureData = prefectureId ? await getPrefectureById(prefectureId) : null
  const prefectureName = prefectureData?.region ?? "都道府県未選択"
  let selectedMunicipality: Municipality | null = null
  if (municipalityId) {
    try {
      selectedMunicipality = await microcmsClient.get<Municipality>({
        endpoint: "municipalities",
        contentId: municipalityId,
      })
    } catch (err) {
      console.error("Failed to fetch municipality", err)
    }
  }

  const PAGE_SIZE = 10
  const offset = (page - 1) * PAGE_SIZE
  const { contents: jobs, totalCount } = await getJobsPaged({
    prefectureId,
    municipalityId,
    tagIds,
    jobCategoryId,
    limit: PAGE_SIZE,
    offset,
  })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const currentPage = Math.min(Math.max(page, 1), totalPages || 1)
  const pagedJobs = jobs

  const tags = await getTags()
  const jobCategories = await getJobCategories()

  // 選択された職種名を取得（未選択の場合はデフォルトでタクシー運転手とする）
  const jobCategoryName = jobCategoryId
    ? jobCategories.find((c) => c.id === jobCategoryId)?.name ?? "タクシー運転手"
    : "タクシー運転手"

  // 職種ごとのヒーロー画像を決定
  const heroImageSrc = (() => {
    if (jobCategoryName.includes("タクシー")) return "/images/taxi.png"
    if (jobCategoryName.includes("看護") || jobCategoryName.includes("介護")) return "/images/nurse-hero.png"
    return "/placeholder.svg"
  })()

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams()
    if (prefectureId) params.set("prefecture", prefectureId)
    if (municipalityId) params.set("municipality", municipalityId)
    if (tagIds.length) params.set("tags", tagIds.join(","))
    if (jobCategoryId) params.set("jobCategory", jobCategoryId)
    if (p > 1) params.set("page", String(p))
    return `/search?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Home className="w-4 h-4 mr-1" />
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/" className="hover:text-teal-600">
            {jobCategoryName}の求人
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>
            {selectedMunicipality ? `${selectedMunicipality.name}（${prefectureName}）` : prefectureName}
            の{jobCategoryName}求人
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src={heroImageSrc}
            alt="hero-image"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div>
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedMunicipality
                  ? `${selectedMunicipality.name}（${prefectureName}）`
                  : prefectureName}
                の{jobCategoryName}の求人情報
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-lg text-gray-600">
                  該当件数 <span className="font-bold text-red-500">{totalCount}件</span>
                </span>
                <Link href="#" className="text-sm text-teal-600 hover:underline">
                  登録情報を変更する
                </Link>
              </div>
            </div>

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

            {/* Search Condition Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">検索条件</h2>
              {(() => {
                const tagNames = tags
                  .filter((t) => tagIds.includes(t.id))
                  .map((t) => t.name)
                const jobCategoryName = jobCategoryId
                  ? jobCategories.find((c) => c.id === jobCategoryId)?.name
                  : "タクシー運転手"

                const parts: string[] = []
                parts.push(prefectureName)
                if (selectedMunicipality) parts.push(selectedMunicipality.name)
                if (jobCategoryName) parts.push(jobCategoryName)
                if (tagNames.length) parts.push(tagNames.join(", "))

                return (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {parts.join(" / ")} の求人を表示中
                  </p>
                )
              })()}
            </div>

            {/* Job Listing Tabs */}
            <Tabs defaultValue="recommended" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recommended">おすすめ順</TabsTrigger>
                <TabsTrigger value="newest">新着順</TabsTrigger>
                <TabsTrigger value="nearest">自宅に近い順</TabsTrigger>
              </TabsList>

              <TabsContent value="recommended" className="mt-6">
                {pagedJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">該当する求人がありません</div>
                ) : (
                  <div className="space-y-6">
                    {pagedJobs.map((job) => {
                      return <JobCard key={job.id} job={job} horizontal />
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="newest">
                <div className="text-center py-8 text-gray-500">新着順の求人一覧がここに表示されます</div>
              </TabsContent>

              <TabsContent value="nearest">
                <div className="text-center py-8 text-gray-500">自宅に近い順の求人一覧がここに表示されます</div>
              </TabsContent>
            </Tabs>

            {/* Pagination (under job list) */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 mb-8">
                <Pagination>
                  <PaginationContent>
                    {/* Prev */}
                    <PaginationItem>
                      {currentPage > 1 ? (
                        <PaginationLink href={buildPageHref(currentPage - 1)} className="px-6 py-2 border text-gray-700 flex items-center gap-1">
                          <ChevronLeft className="w-4 h-4" /> 前へ
                        </PaginationLink>
                      ) : (
                        <span className="px-6 py-2 border bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-1">
                          <ChevronLeft className="w-4 h-4" /> 前へ
                        </span>
                      )}
                    </PaginationItem>

                    {/* Page numbers */}
                    {(() => {
                      const elements: (number | "ellipsis")[] = []
                      if (totalPages <= 5) {
                        for (let i = 1; i <= totalPages; i++) elements.push(i)
                      } else {
                        elements.push(1, 2, "ellipsis", totalPages)
                      }
                      return elements.map((elm, idx) => (
                        <PaginationItem key={idx}>
                          {elm === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href={buildPageHref(elm)}
                              isActive={elm === currentPage}
                              className={elm === currentPage ? "bg-teal-600 text-white" : ""}
                            >
                              {elm}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))
                    })()}

                    {/* Next */}
                    <PaginationItem>
                      {currentPage < totalPages ? (
                        <PaginationLink href={buildPageHref(currentPage + 1)} className="px-6 py-2 border text-teal-600 flex items-center gap-1">
                          次へ <ChevronRight className="w-4 h-4" />
                        </PaginationLink>
                      ) : (
                        <span className="px-6 py-2 border bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-1">
                          次へ <ChevronRight className="w-4 h-4" />
                        </span>
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Sidebar removed */}
        </div>
      </div>

      {/* News Section */}
      <RidejobMediaSection />

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
