import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, User, UserPlus, ChevronRight, Home } from "lucide-react"
import { getPrefectureById } from "@/lib/getPrefectures"
import { getMunicipalitiesByPrefectureId } from "@/lib/getMunicipalities"
import { getJobs, getJobCount } from "@/lib/getJobs"
import { getTags } from "@/lib/getTags"
import { getJobCategories } from "@/lib/getJobCategories"
import MunicipalityDialog from "./components/municipality-dialog"
import TagDialog from "@/components/tags-dialog"
import JobCategoryDialog from "@/components/job-category-dialog"

interface SearchResultsPageProps {
  prefectureId?: string
  municipalityId?: string
  tagIds?: string[]
  jobCategoryId?: string
}

export default async function SearchResultsPage({ prefectureId, municipalityId, tagIds = [], jobCategoryId }: SearchResultsPageProps) {
  const prefectureData = prefectureId ? await getPrefectureById(prefectureId) : null
  const prefectureName = prefectureData?.region ?? "都道府県未選択"
  const municipalitiesRaw = prefectureId ? await getMunicipalitiesByPrefectureId(prefectureId) : []
  // 各市区町村の求人数を取得
  const municipalities = await Promise.all(
    municipalitiesRaw.map(async (m) => {
      const count = await getJobCount({ municipalityId: m.id })
      return { ...m, jobCount: count }
    }),
  )
  const selectedMunicipality = municipalityId ? municipalities.find((m) => m.id === municipalityId) : null
  const jobs = await getJobs({ prefectureId, municipalityId, tagIds, jobCategoryId })

  const tags = await getTags()
  const jobCategories = await getJobCategories()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="text-2xl font-bold text-teal-500">ジョブメドレー</div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">LINEで仕事探し 履歴書添削 ご利用ガイド 求人掲載をお考えの方へ</div>
              <Search className="w-5 h-5 text-gray-400" />
              <Button variant="ghost" size="sm" className="text-teal-600">
                <MapPin className="w-4 h-4 mr-1" />
                最近見た求人
              </Button>
              <Button variant="ghost" size="sm" className="text-teal-600">
                <User className="w-4 h-4 mr-1" />
                ログイン
              </Button>
              <Button variant="ghost" size="sm">
                <UserPlus className="w-4 h-4 mr-1" />
                会員登録
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Home className="w-4 h-4 mr-1" />
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/" className="hover:text-teal-600">
            介護事務の求人
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>
            {selectedMunicipality ? `${selectedMunicipality.name}（${prefectureName}）` : prefectureName}
            の介護事務求人
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=200&width=800" alt="東京駅" fill className="object-cover" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedMunicipality
                  ? `${selectedMunicipality.name}（${prefectureName}）`
                  : prefectureName}
                の介護事務求人・転職・就職・アルバイト情報
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-lg text-gray-600">
                  該当件数 <span className="font-bold text-red-500">{jobs.length}件</span>
                </span>
                <Link href="#" className="text-sm text-teal-600 hover:underline">
                  登録情報を変更する
                </Link>
              </div>
            </div>

            {/* Search Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <MunicipalityDialog
                municipalities={municipalities}
                prefectureId={prefectureId ?? ""}
                prefectureName={prefectureName}
              />
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
                const jobCategoryName = jobCategories.find((c) => c.id === jobCategoryId)?.name

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
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">該当する求人がありません</div>
                ) : (
                  <div className="space-y-6">
                    {jobs.map((job) => {
                      const imageUrl =
                        job.imageUrl ??
                        `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(job.title)}`

                      return (
                        <Card key={job.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                              <Image
                                src={imageUrl}
                                alt={job.title}
                                width={300}
                                height={200}
                                className="w-full h-48 md:h-full object-cover"
                              />
                            </div>
                            <div className="md:w-2/3 p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-teal-600 mb-2">{job.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  {job.municipality?.name ?? ""}
                                  {job.municipality ? "・" : ""}
                                  {job.prefecture?.region ?? ""}
                                </p>
                                {job.tags && job.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {job.tags.map((tag) => (
                                      <span
                                        key={tag.id}
                                        className="bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded"
                                      >
                                        {tag.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-3">
                                <Link href={`/job/${job.id}`} className="flex-1">
                                  <Button className="w-full bg-teal-600 hover:bg-teal-700">求人を見る</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-teal-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">地域から求人を探す</h3>
                </div>
              </CardContent>
            </Card>

            {/* Job Search Tips */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">必ず役立つ仕事探し術</h3>
                <div className="space-y-3">
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">💼</span>
                    ぴったりな仕事を探すには
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">✈️</span>
                    応募の仕方
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">📝</span>
                    履歴書の書き方
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">📧</span>
                    メールやメッセージの書き方
                  </Link>
                  <Link href="#" className="flex items-center text-sm text-teal-600 hover:underline">
                    <span className="mr-2">📱</span>
                    初回勤務までの準備
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Popular Columns */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">人気のコラムランキング</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      1位
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        失業手当（失業保険）はいくらもらえる？改正された失業給付条件や申請方法を...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      2位
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        年間休日の平均や内訳は？123日・120日・110日・105日って実際どのくらい休み...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      3位
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        バイタルサインとは？おさえておきたい正常値や異常値の目安、正確な測定方法
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-teal-600 mt-4">
                  コラムをもっと見る
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">なるほど！ジョブメドレー新着記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Article 1 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="養護老人ホーム"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  養護老人ホームとは？特養との違いや仕事内容を紹介
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded">職種を知る</span>
                  <span>2024/08/13</span>
                </div>
              </CardContent>
            </Card>

            {/* Article 2 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="年末調整"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  【2024年変更点あり】年末調整とは？対象者や書き方、確定...
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">仕事お役立ち情報</span>
                  <span>2023/10/04</span>
                </div>
              </CardContent>
            </Card>

            {/* Article 3 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="転職面接"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  異業種への転職は難しい？失敗しないための転職活動の...
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded">求人の見方・転職ガイド</span>
                  <span>2023/06/19</span>
                </div>
              </CardContent>
            </Card>

            {/* Article 4 */}
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="コロナ対策"
                width={300}
                height={150}
                className="w-full h-36 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  コロナ5類移行「面会制限やや緩和」50％以上 医療・介護従...
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">コラム</span>
                  <span>2023/05/30</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
              なるほど！ジョブメドレーをもっと見る
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-teal-500">ジョブメドレー</div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
            </Button>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              介護事務の求人をお探しならジョブメドレー。あなたにぴったりの求人が見つかります。ジョブメドレーは、医療介護従事者が転職をする際に転職・就職・復職を支援する求人サイトです。ほぼすべての医療介護職種を取り扱っており、介護事務の求人を含む、全国306万件の事業所の正社員、アルバイト・パート募集情報を掲載しています（2025年6月19日現在）。求人の応募から入職まで、専任のキャリアサポートが転職をサポートします。また、会員登録をしていただくと、希望条件に合った新着求人や、スカウトメッセージを受け取ることができます。介護事務の転職、就職なら医療介護求人サイト「ジョブメドレー」にお任せください。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">ジョブメドレーについて</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ご利用ガイド
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ご利用規約
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  外部送信ポリシー
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ヘルプ
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  ミッション
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  なるほど！ジョブメドレー
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  転職体験談
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  お知らせ
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  運営会社情報
                </Link>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">採用担当者様へ</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  求人掲載をお考えの企業様
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  リンク設置について
                </Link>
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  採用担当ログイン
                </Link>
              </div>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">お困りの方はこちら</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-teal-600 hover:underline">
                  各種ご相談・お問い合わせ窓口
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
