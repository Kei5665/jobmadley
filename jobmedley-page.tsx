import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Star, User, UserPlus, ChevronRight, Home } from "lucide-react"
import { getPrefectureGroups } from "@/lib/getPrefectures"
import { getJobCount, getJobs } from "@/lib/getJobs"
import { microcmsClient2 } from "@/lib/microcms"
import PrefectureTabsSection from "@/components/prefecture-tabs"

interface BlogArticle {
  id: string;
  title: string;
  slug?: string;
  eyecatch?: { url: string };
}

export default async function Component() {
  const prefectures = await getPrefectureGroups()

  // 各都道府県の求人数を取得
  const prefList = Object.values(prefectures).flat()
  const countEntries = await Promise.all(
    prefList.map(async (pref) => {
      const count = await getJobCount({ prefectureId: pref.id })
      return [pref.id, count] as const
    })
  )
  const countMap = Object.fromEntries(countEntries) as Record<string, number>

  // 最新 4 件の求人を取得
  const latestJobs = await getJobs({ limit: 4 })

  const articleData = await microcmsClient2.get<{ contents: BlogArticle[] }>({
    endpoint: "blogs",
    queries: { limit: 4, orders: "-publishedAt" },
  })
  const latestArticles = articleData.contents

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
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Home className="w-4 h-4 mr-1" />
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>タクシー運転手の求人</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">タクシー運転手の</h1>
                <p className="text-lg text-gray-600">求人 転職 就職 アルバイト募集情報</p>
              </div>
              <div className="flex-1">
                <Image
                  src="/images/taxi.png"
                  alt="タクシー運転手"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PrefectureTabsSection prefectures={prefectures} countMap={countMap} />
      <div className="border-b border-gray-200 my-8" />

      {/* Pickup Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Job Listings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">最新の求人</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestJobs.map((job) => {
                  const imageUrl = job.images?.[0]?.url ?? job.imageUrl ?? "/placeholder.svg"
                  return (
                    <Card key={job.id} className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={imageUrl}
                          alt=""
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{job.title}</h3>
                        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                          {job.municipality?.name ?? ""}
                          {job.municipality ? "・" : ""}
                          {job.prefecture?.region ?? ""}
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1">
                            <Star className="w-4 h-4 mr-1" />
                            キープする
                          </Button>
                          <Link href={`/job/${job.id}`} className="flex-1">
                            <Button className="w-full bg-teal-600 hover:bg-teal-700">求人を見る</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Job Experience Stories */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">新着転職体験談</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👩</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        在職中でも気軽に応募できるのと担当者とメールのやり取りが履歴書できるのでメリット...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">介護事務 40代</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👩</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        ジョブメドレーさんは高齢に沿った事業所を紹介してくれるので色々と選択肢が出せ...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">介護事務 40代</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👩</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        面接先との連絡がメッセージ機能でやりとりしやすかったです。面接の事前のサポー...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">介護事務 40代</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-teal-600 mt-4">
                  体験談をもっと見る
                </Button>
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
                        年間休日の平均や内訳は？123日 120日 110日 105日って実際どのくらい休み...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      3位
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        バイタルサインとは？おさえておきたい正常値や異常値の目安 正確な測定方法
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
            {latestArticles.map((article: BlogArticle) => {
              const img = article.eyecatch?.url ?? "/placeholder.jpg"
              return (
                <Card key={article.id} className="overflow-hidden">
                  <Image src={img} alt="" width={300} height={200} className="w-full h-48 object-cover" />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                    <Link
                      href={`https://ridejob-cms.vercel.app/blogs/${article.slug ?? article.id}`}
                      className="text-teal-600 text-sm hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      記事を読む
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
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
              介護事務の求人をお探しならジョブメドレー。あなたにぴったりの求人が見つかります。ジョブメドレーは
              医療介護従事者が転職をする際に転職 就職
              復職を支援する求人サイトです。ほぼすべての医療介護職種を取り扱っており 介護事務の求人を含む
              全国306万件の事業所の正社員 アルバイト
              パート募集情報を掲載しています（2025年6月19日現在）。求人の応募から入職まで
              専任のキャリアサポートが転職をサポートします。また 会員登録をしていただくと 希望条件に合った新着求人や
              スカウトメッセージを受け取ることができます。介護事務の転職
              就職なら医療介護求人サイト「ジョブメドレー」にお任せください。
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
                  各種ご相談 お問い合わせ窓口
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
