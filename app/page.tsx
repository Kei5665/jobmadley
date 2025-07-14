import { Suspense } from "react"
import { ChevronRight, Home } from "lucide-react"
import { getPrefectureGroups } from "@/lib/getPrefectures"
import { getJobCount, getJobs } from "@/lib/getJobs"
import { microcmsClient2 } from "@/lib/microcms"
import { withErrorHandling } from "@/lib/error-handling"
import { Loading } from "@/components/ui/loading"
import { ErrorDisplay } from "@/components/ui/error-display"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import RegionSearchSection from "@/components/prefecture-region-section"
import HeroSection from "./components/hero-section"
import LatestJobsSection from "./components/latest-jobs-section"
import MediaSection from "./components/media-section"
import type { BlogArticle } from "@/lib/types"

async function HomePageContent() {
  try {
    const [prefectures, latestJobs, companyArticles, interviewArticles] = await Promise.all([
      withErrorHandling(() => getPrefectureGroups(), "getPrefectureGroups"),
      withErrorHandling(() => getJobs({ limit: 4, orders: "-publishedAt" }), "getLatestJobs"),
      withErrorHandling(
        () => microcmsClient2.get<{ contents: BlogArticle[] }>({
          endpoint: "blogs",
          queries: { filters: `category[equals]2`, limit: 3, orders: "-publishedAt" },
        }),
        "getCompanyArticles"
      ).then(data => data.contents),
      withErrorHandling(
        () => microcmsClient2.get<{ contents: BlogArticle[] }>({
          endpoint: "blogs",
          queries: { filters: `category[equals]5`, limit: 3, orders: "-publishedAt" },
        }),
        "getInterviewArticles"
      ).then(data => data.contents),
    ])

    // 各都道府県の求人数を取得
    const prefList = Object.values(prefectures).flat()
    const countEntries = await Promise.all(
      prefList.map(async (pref) => {
        try {
          const count = await withErrorHandling(
            () => getJobCount({ prefectureId: pref.id }),
            `getJobCount-${pref.id}`
          )
          return [pref.id, count] as const
        } catch (error) {
          console.warn(`Failed to get job count for ${pref.region}:`, error)
          return [pref.id, 0] as const
        }
      })
    )
    const countMap = Object.fromEntries(countEntries) as Record<string, number>

    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Home className="w-4 h-4 mr-1" />
            <ChevronRight className="w-4 h-4 mx-1" />
            <span>トップページ</span>
          </div>
        </div>

        <HeroSection />
        <RegionSearchSection prefectures={prefectures} countMap={countMap} />
        <LatestJobsSection jobs={latestJobs} />
        <MediaSection 
          companyArticles={companyArticles}
          interviewArticles={interviewArticles}
        />
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
            title="ページの読み込みに失敗しました"
            onRetry={() => window.location.reload()}
          />
        </div>
        <SiteFooter />
      </div>
    )
  }
}

export default async function HomePage() {
  return (
    <Suspense fallback={<Loading message="ページを読み込み中..." />}>
      {/* @ts-expect-error Async Server Component */}
      <HomePageContent />
    </Suspense>
  )
}
