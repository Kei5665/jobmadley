import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import RidejobMediaSection from "@/components/ridejob-media-section"
import { getPrefectureById } from "@/lib/getPrefectures"
import { getPrefectureGroups } from "@/lib/getPrefectures"
import { getJobsPaged } from "@/lib/getJobs"
import { getMunicipalityById } from "@/lib/getMunicipalities"
import { getTags } from "@/lib/getTags"
import { getJobCategories } from "@/lib/getJobCategories"
import { getMediaArticles } from "@/lib/getMediaArticles"
import { buildSearchQuery } from "@/lib/utils"
import { withErrorHandling } from "@/lib/error-handling"
import { ErrorDisplay } from "@/components/ui/error-display"
import SearchHeader from "./components/search-header"
import SearchConditionSummary from "./components/search-condition-summary"
import JobList from "./components/job-list"
import SearchPagination from "./components/search-pagination"
import SortTabs from "./components/sort-tabs"
import FilterSidebar from "./components/filter-sidebar"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    prefecture?: string
    municipality?: string
    tags?: string
    jobCategory?: string
    page?: string
    sort?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const keyword = params.q
  const prefectureId = params.prefecture
  const municipalityId = params.municipality
  const tagIds = params.tags ? params.tags.split(",") : []
  const jobCategoryId = params.jobCategory
  const page = params.page ? Number(params.page) : 1
  const sort = params.sort ?? "recommended"

  try {
    const [
       prefectureData,
      selectedMunicipality,
      { contents: jobs, totalCount },
      tags,
      jobCategories,
      mediaArticles,
       prefectureGroups,
    ] = await Promise.all([
      prefectureId ? withErrorHandling(
        () => getPrefectureById(prefectureId),
        "getPrefectureById"
      ) : null,
      municipalityId ? withErrorHandling(
        () => getMunicipalityById(municipalityId),
        "getMunicipalityById"
      ) : null,
       withErrorHandling(
        () => getJobsPaged({
          prefectureId,
          municipalityId,
          tagIds,
          jobCategoryId,
          keyword,
           limit: 10,
          offset: (page - 1) * 10,
           orders: "-publishedAt",
        }),
        "getJobsPaged"
      ),
      withErrorHandling(() => getTags(), "getTags"),
      withErrorHandling(() => getJobCategories(), "getJobCategories"),
       withErrorHandling(() => getMediaArticles(), "getMediaArticles"),
       withErrorHandling(() => getPrefectureGroups(), "getPrefectureGroups"),
    ])

    const { companyArticles, interviewArticles } = mediaArticles

    const prefectureName = prefectureData?.region ?? "都道府県未選択"
    const totalPages = Math.ceil(totalCount / 10)
    const currentPage = Math.min(Math.max(page, 1), totalPages || 1)

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
      const query = buildSearchQuery({
        keyword,
        prefectureId,
        municipalityId,
        tagIds,
        jobCategoryId,
        page: p,
        sort,
      })
      return `/search?${query}`
    }

    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        
        <SearchHeader
          jobCategoryName={jobCategoryName}
          prefectureName={prefectureName}
          selectedMunicipality={selectedMunicipality}
          heroImageSrc={heroImageSrc}
          totalCount={totalCount}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            {/* サイドバー（PC）/ 上部（SP） */}
            <div className="order-1 md:order-none">
              <FilterSidebar
                keyword={keyword}
                prefectureId={prefectureId}
                prefectureName={prefectureName}
                municipalityId={municipalityId}
                jobCategories={jobCategories}
                jobCategoryId={jobCategoryId}
                tags={tags}
                tagIds={tagIds}
                prefectureGroups={prefectureGroups}
              />
            </div>

            {/* 結果エリア */}
            <div className="order-2 md:order-none">
              <SearchConditionSummary
                keyword={keyword}
                prefectureName={prefectureName}
                selectedMunicipality={selectedMunicipality}
                jobCategoryName={jobCategoryName}
                tags={tags}
                tagIds={tagIds}
                jobCategories={jobCategories}
                jobCategoryId={jobCategoryId}
              />

              <div className="mb-4">
                <SortTabs />
              </div>

              <JobList jobs={jobs} />

              <SearchPagination
                currentPage={currentPage}
                totalPages={totalPages}
                buildPageHref={buildPageHref}
              />
            </div>
          </div>
        </div>

        <RidejobMediaSection companyArticles={companyArticles} interviewArticles={interviewArticles} />
        <SiteFooter />
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay
            error={error}
            title="検索結果の取得に失敗しました"
            onRetry={() => window.location.reload()}
          />
        </div>
        <SiteFooter />
      </div>
    )
  }
}
