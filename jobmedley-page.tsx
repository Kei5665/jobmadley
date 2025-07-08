import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Briefcase, Wallet, ChevronRight, Home } from "lucide-react"
import { getPrefectureGroups } from "@/lib/getPrefectures"
import { getJobCount, getJobs } from "@/lib/getJobs"
import { microcmsClient2 } from "@/lib/microcms"
import RegionSearchSection from "@/components/prefecture-region-section"

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

  // ブログ記事をカテゴリ別に取得
  interface BlogArticleExt extends BlogArticle {
    publishedAt?: string
    category?: { slug: string; name: string }
    company?: string
  }

  const fetchArticles = async (categoryId: string) => {
    const data = await microcmsClient2.get<{ contents: BlogArticleExt[] }>({
      endpoint: "blogs",
      queries: { filters: `category[equals]${categoryId}`, limit: 3, orders: "-publishedAt" },
    })
    return data.contents
  }

  const [companyArticles, interviewArticles] = await Promise.all([
    fetchArticles("2"), // 企業取材
    fetchArticles("5"), // インタビュー
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ */}
            <Link href="/" className="flex items-center">
              <Image src="/images/logo-ridejob.png" alt="RIDE JOB" width={120} height={32} />
            </Link>

            {/* CTA ボタン */}
            <div className="flex space-x-3">
              <Link href="/contact">
                <Button className="bg-[#05AADB] hover:bg-[#0399C6] text-white px-4 py-2 text-sm rounded">
                  まずお話を聞く
                </Button>
              </Link>
              <Link href="/search">
                <Button className="bg-[#1600FF] hover:bg-[#0E00D1] text-white px-4 py-2 text-sm rounded">
                  求人情報を見る
                </Button>
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
          <span>トップページ</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative mb-12">
        {/* 背景画像 */}
        <div
          className="relative h-[320px] md:h-[380px] lg:h-[420px] w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/top-bg.png')" }}
        >
          {/* 背景画像そのまま、オーバーレイなし */}

          {/* コンテンツ */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-7xl mx-auto px-4">
            {/* 検索ボックスは下部に重ねて配置する */}
          </div>

          {/* 浮かせた検索ボックス */}
          <div className="absolute left-1/2 bottom-0 translate-y-1/4 -translate-x-1/2 w-full max-w-5xl px-4 z-20">
            <div className="bg-gradient-to-r from-[#1f1fff] via-[#0044ff] to-[#1aa9ff] rounded-xl shadow-2xl">
              <div className="px-6 py-6">
                {/* タイトル画像 */}
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/search-form-text.png"
                    alt="RIDE JOB 全国で求人掲載中！"
                    width={700}
                    height={60}
                    priority
                  />
                </div>

                {/* 検索フォーム */}
                <div className="mt-6 flex rounded-md overflow-hidden bg-white">
                  <Input
                    placeholder="フリーワード"
                    className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none text-sm"
                  />
                  <Button
                    className="bg-[#2000d8] hover:bg-[#1800b6] text-white px-8 flex items-center gap-1 rounded-none"
                  >
                    <Search className="w-4 h-4" />
                    検索
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 勤務先検索セクション */}
      <RegionSearchSection prefectures={prefectures} countMap={countMap} />

      {/* 最新の求人 Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-24">
        <h2 className="text-xl md:text-3xl font-bold mb-6 flex items-center">
          <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3 rounded" />
          最新の求人
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestJobs.map((job) => {
                  const imageUrl = job.images?.[0]?.url ?? job.imageUrl ?? "/placeholder.svg"
                  return (
                    <Card key={job.id} className="rounded-lg shadow-md bg-white overflow-hidden">
                      <div className="relative">
                        <Image
                          src={imageUrl}
                          alt=""
                          width={300}
                          height={160}
                          className="w-full h-40 object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{job.title}</p>

                        {/* 場所 */}
                        {job.municipality?.name && (
                          <div className="flex items-center text-xs text-gray-600 gap-1 border-t border-gray-200 pt-2">
                            <MapPin className="w-4 h-4 text-indigo-600" />
                            <span>
                              {job.prefecture?.region ?? ""} {job.municipality.name}
                            </span>
                          </div>
                        )}

                        {/* 給与 */}
                        {(job.salaryMin || job.salaryMax) && (
                          <div className="flex items-center text-xs text-gray-600 gap-1 border-t border-gray-200 pt-2">
                            <Wallet className="w-4 h-4 text-indigo-600" />
                            <span>
                              月給
                              {job.salaryMin ? ` ${job.salaryMin.toLocaleString()}` : ""}
                              {job.salaryMax ? `〜${job.salaryMax.toLocaleString()}` : "〜"}
                            </span>
                          </div>
                        )}

                        {/* 職種 */}
                        {job.jobName && (
                          <div className="flex items-center text-xs text-gray-600 gap-1 border-t border-gray-200 pt-2">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                            <span>{job.jobName}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
      </section>

      {/* Media Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-24">
        <h2 className="text-xl md:text-3xl font-bold mb-8 flex items-center">
          <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3 rounded" />
          ライドジョブ メディア
        </h2>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Interview Column */}
            <div>
              <h3 className="text-2xl font-bold mb-1">企業取材</h3>
              <p className="text-sm text-gray-600 mb-6">職場の雰囲気やスタッフの声を取材し、安心して応募できるリアルな情報！</p>

              <div className="space-y-6">
                {companyArticles.map((a) => {
                  const img = a.eyecatch?.url ?? "/placeholder.jpg"
                  return (
                    <Link key={a.id} href={`https://ridejob-cms.vercel.app/blogs/${a.slug ?? a.id}`} target="_blank" className="block group">
                      <div className="flex gap-4 items-start border-b border-gray-200">
                        <Image src={img} alt="" width={100} height={80} className="w-24 h-20 object-cover rounded" />
                        <div className="flex-1 pb-4">
                          <div className="flex items-center text-[10px] text-gray-500 gap-2 mb-1">
                            <span className="inline-block bg-indigo-600 text-white px-2 py-0.5 rounded-sm">企業取材</span>
                            <span>{a.publishedAt?.slice(0,10) ?? ""}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:underline">
                            {a.title}
                          </p>
                          {a.company && <p className="text-xs text-gray-500 mt-1">{a.company}</p>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Interview Column */}
            <div>
              <h3 className="text-2xl font-bold mb-1">インタビュー</h3>
              <p className="text-sm text-gray-600 mb-6">転職活動に役立つノウハウや、現場のリアルな声を交えた業界情報をお届け！</p>

              <div className="space-y-6">
                {interviewArticles.map((a) => {
                  const img = a.eyecatch?.url ?? "/placeholder.jpg"
                  return (
                    <Link key={a.id} href={`https://ridejob-cms.vercel.app/blogs/${a.slug ?? a.id}`} target="_blank" className="block group">
                      <div className="flex gap-4 items-start border-b border-gray-200">
                        <Image src={img} alt="" width={100} height={80} className="w-24 h-20 object-cover rounded" />
                        <div className="flex-1 pb-4">
                          <div className="flex items-center text-[10px] text-gray-500 gap-2 mb-1">
                            <span className="inline-block bg-indigo-600 text-white px-2 py-0.5 rounded-sm">インタビュー</span>
                            <span>{a.publishedAt?.slice(0,10) ?? ""}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:underline">
                            {a.title}
                          </p>
                          {a.company && <p className="text-xs text-gray-500 mt-1">{a.company}</p>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* more button */}
          <div className="text-center mt-12">
            <Link href="https://ridejob-cms.online/blogs" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#2000d8] hover:bg-[#1800b6] text-white px-8 py-4 rounded-full inline-flex items-center gap-2">
                記事をもっと見る
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Logo & description */}
          <div className="max-w-4xl">
            <Image src="/images/logo-ridejob.png" alt="RIDE JOB" width={160} height={40} />
            <p className="text-sm text-gray-600 leading-relaxed mt-6">
              ドライバーの求人をお探しならライドジョブ。あなたにぴったりの求人が見つかります。ドライバー運転・整備・現場職に携わる方々の、転職・就職を支援する求人サイトです。
              全国000件の事業所の正社員 アルバイト パート募集情報を掲載しています（2025年7月31日現在）。求人の応募から入職まで専任のキャリアが転職をサポートします。転職・就職なら「ライドジョブ」にお任せください。
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4">ライドジョブについて</h3>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li><Link href="#" className="hover:underline">ご利用規約</Link></li>
                <li><Link href="#" className="hover:underline">ミッション</Link></li>
                <li><Link href="#" className="hover:underline">転職体験談</Link></li>
                <li><Link href="#" className="hover:underline">プライバシーポリシー</Link></li>
                <li><Link href="#" className="hover:underline">運営会社情報</Link></li>
                <li><Link href="#" className="hover:underline">お問い合わせ</Link></li>
              </ul>
            </div>

            {/* Recruiters */}
            <div>
              <h3 className="font-bold text-lg mb-4">採用担当者様へ</h3>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li><Link href="#" className="hover:underline">求人掲載をお考えの企業様</Link></li>
              </ul>
            </div>

            {/* Media */}
            <div>
              <h3 className="font-bold text-lg mb-4">運営メディア</h3>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li><Link href="https://ridejob-cms.online/blogs" target="_blank" className="hover:underline">ライドジョブ</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact button */}
          <div className="text-center md:text-left">
            <Link href="#" className="inline-block">
              <Button className="bg-[#2000d8] hover:bg-[#1800b6] text-white px-8 py-4 rounded-full inline-flex items-center gap-2">
                各種ご相談 お問い合わせ窓口
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
