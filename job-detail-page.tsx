"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, User, UserPlus, ChevronRight, Home, ChevronLeft } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { JobDetail } from "@/lib/getJob"

interface JobDetailPageProps {
  job: JobDetail
}

export default function JobDetailPage({ job }: JobDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images =
    job.images && (job.images as any[]).length > 0
      ? (job.images as any[]).map((img) => (typeof img === "string" ? img : (img as any).url))
      : ["/placeholder.svg"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const jobId = job.id

  // NEW バッジ表示条件: 公開日または作成日が 7 日以内
  const publishedDate = job.publishedAt ?? job.createdAt
  const isNew = publishedDate ? Date.now() - new Date(publishedDate).getTime() < 7 * 24 * 60 * 60 * 1000 : false

  // CTA ボタン表示制御
  const [showCta, setShowCta] = useState(false)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const triggerEl = triggerRef.current
    const footerEl = footerRef.current
    if (!triggerEl || !footerEl) return

    const triggerOffset = triggerEl.offsetTop
    const footerOffset = footerEl.offsetTop

    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportBottom = scrollY + window.innerHeight
      const pastTrigger = scrollY > triggerOffset
      const beforeFooter = viewportBottom < footerOffset
      setShowCta(pastTrigger && beforeFooter)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

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
                <Star className="w-4 h-4 mr-1" />
                キープ
              </Button>
              <Button variant="ghost" size="sm">
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
            タクシー運転手の求人
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/search?prefecture=東京都" className="hover:text-teal-600">
            東京都
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/search?prefecture=東京都" className="hover:text-teal-600">
            東京都の求人
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/search?prefecture=東京都&city=中野区" className="hover:text-teal-600">
            中野区
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>リブウェル足立入谷の介護事務求人</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Carousel */}
            <div className="relative mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt="介護事務スタッフ"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Job Title and Actions */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {isNew && <Badge className="bg-red-500 text-white mr-2">NEW</Badge>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {job.jobName ?? job.title}
                  </h1>
                  {job.companyName ? (
                    <Link href="#" className="text-teal-600 hover:underline">
                      {job.companyName}
                    </Link>
                  ) : (
                    <span className="text-gray-700">会社情報なし</span>
                  )}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.tags.map((t) => (
                        <Badge key={t.id} className="bg-gray-100 text-gray-600" variant="secondary">
                          {t.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-3 ml-6">
                  <Link href={`/apply/${jobId}`}>
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
                      応募画面へ進む
                      <div className="text-xs ml-2 bg-white text-red-500 px-2 py-1 rounded">
                        約1分!
                        <br />
                        すぐ完了
                      </div>
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    キープする
                  </Button>
                </div>
              </div>

              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg inline-block mb-4">
                {job.salaryMin && job.salaryMax
                  ? `月給${job.salaryMin.toLocaleString()}円～${job.salaryMax.toLocaleString()}円`
                  : job.salaryMin
                  ? `月給${job.salaryMin.toLocaleString()}円〜`
                  : "給与情報なし"}
              </div>
              {job.updatedAt && (
                <p className="text-sm text-gray-500">最終更新日 {new Date(job.updatedAt).toLocaleDateString()}</p>
              )}
            </div>

            {/* トリガー: 募集内容エリア開始 */}
            <div ref={triggerRef} />
            {/* Job Description */}
            <div className="space-y-8 mt-12 border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800">募集内容</h2>
              {/* アピールポイント */}
              {job.descriptionAppeal && (
                <div>
                  <h3 className="text-lg border-t pt-8 font-semibold text-gray-800 mb-4">アピールポイント</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.descriptionAppeal}</p>
                </div>
              )}

              {/* 詳細情報 */}
              {/* 募集職種 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">募集職種</h3>
                {job.jobCategory ? (
                  <p className="text-gray-700">{job.jobCategory.name}</p>
                ) : (
                  <p className="text-gray-700">職種情報なし</p>
                )}
              </div>

              {/* 仕事内容 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">仕事内容</h3>
                {job.descriptionWork ? (
                  <p className="text-gray-700 mb-6 whitespace-pre-wrap">{job.descriptionWork}</p>
                ) : (
                  <>
                    <p className="text-gray-700 mb-4">仕事内容なし</p>
                  </>
                )}
              </div>

              {/* 求める人材 */}
              {job.descriptionPerson && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">求める人材</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.descriptionPerson}</p>
                </div>
              )}

              {/* 給与 */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">給与</h3>
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  {job.employmentType && `【${job.employmentType}】`}
                  {job.wageType || "給与形態未設定"}
                  {job.salaryMin && (
                    <> {job.salaryMin.toLocaleString()}円</>
                  )}
                  {job.salaryMax && (
                    <>〜{job.salaryMax.toLocaleString()}円</>
                  )}
                </p>
                <div className="text-gray-700 space-y-1">
                  {job.avgScheduledHour && <p>平均所定労働時間: {job.avgScheduledHour}時間</p>}
                </div>

                {job.salaryNote && (
                  <div className="border-t pt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">給与の備考</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.salaryNote}</p>
                  </div>
                )}
              </div>

              {/* 勤務形態 */}
              {job.workStyle && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">勤務形態</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.workStyle}</p>
                </div>
              )}

            {/* 勤務時間 */}
              {job.workHours && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">勤務時間</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.workHours}</p>
                </div>
              )}


              {/* 福利厚生 */}
              {(job.socialInsurance || job.ssReason) && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">福利厚生</h3>
                  {job.socialInsurance && (
                    <p className="text-gray-700 mb-2 whitespace-pre-wrap">{job.socialInsurance}</p>
                  )}
                  {job.ssReason && (
                    <p className="text-gray-700 mb-2 whitespace-pre-wrap">{job.ssReason}</p>
                  )}
                  {job.descriptionBenefits && (
                    <p className="text-gray-700 whitespace-pre-wrap">{job.descriptionBenefits}</p>
                  )}
                </div>
              )}

              {/* 休日 */}
              {job.holidays && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">休日</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.holidays}</p>
                </div>
              )}

              {/* その他 */}
              {job.descriptionOther && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">その他</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.descriptionOther}</p>
                </div>
              )}

            </div>
            {/* Photo Gallery */}
            <div className="border rounded-lg p-6 mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">写真</h3>
              <div className="grid grid-cols-2 gap-4">
                {images.map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    alt={`写真${idx + 1}`}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>

            {/* 会社情報 */}
            <div className="border rounded-lg p-6 mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">会社情報</h3>

              <div className="space-y-6">
                {/* Company Name */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="font-medium text-gray-700">会社名</div>
                  <div className="md:col-span-3">
                    {job.companyName ? (
                      <Link href="#" className="text-teal-600 hover:underline">
                        {job.companyName}
                      </Link>
                    ) : (
                      <span className="text-gray-700">会社情報なし</span>
                    )}
                  </div>
                </div>


                {/* アクセス */}
                <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="font-medium text-gray-700">アクセス</div>
                  <div className="md:col-span-3 space-y-2">
                    {(job.addressZip || job.addressPrefMuni || job.addressLine) && (
                      <p className="text-gray-700">
                        {job.addressZip && `〒${job.addressZip} `}
                        {job.addressPrefMuni}
                        {job.addressLine}
                        {job.addressBuilding}
                      </p>
                    )}
                    {job.dlNote && (
                      <p className="text-gray-700 whitespace-pre-wrap">{job.dlNote}</p>
                    )}
                    {job.access && (
                      <p className="text-gray-700 whitespace-pre-wrap">{job.access}</p>
                    )}

                    {/* Google Map */}
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (job.addressPrefMuni || job.addressLine) && (
                      <div className="h-64 w-full rounded-lg overflow-hidden">
                        <iframe
                          title="map"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                            `${job.addressPrefMuni ?? ""}${job.addressLine ?? ""}${job.addressBuilding ?? ""}`
                          )}`}
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="border rounded-lg p-6 mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">応募に関するよくある質問</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">応募情報はどのように事業所に伝わりますか？</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    応募いただいた情報は、ジョブメドレーから安全に事業所へ連携されます。また、スカウト機能を「受け取る」に設定していただくと、それまでのプロフィールを見た事業所から直接スカウトが届くことがあります。ご希望の方は、プライバシーポリシーをご確認ください。
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    応募する前に事業所に質問したいときはどうすればよいですか？
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    事業所の詳細な情報を知りたい場合や、応募前に質問したいことがある場合は、ページ下の「お問い合わせ」からご連絡ください。
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">求人内容について電話で質問することはできますか？</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    応募前、ジョブメドレーにご登録いただいた方には電話でのご連絡も可能です。事業所に直接お電話いただくことも可能です。
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">応募を検討する</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    電話で応募したいときはどうすればよいですか？
                    「電話で応募」ボタンから直接お電話いただくか、お電話番号をお調べいただき、お電話ください。
                    お電話の際はジョブメドレーを見たとお伝えいただくとスムーズです。
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link href="#" className="text-teal-600 hover:underline">
                  事業所へお問い合わせする
                </Link>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">東京都の介護事務の新着求人</h3>
                <div className="space-y-4">
                  {/* Related Job 1 */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Image
                      src="/placeholder.svg?height=60&width=80"
                      alt="ホームケアまき"
                      width={80}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">ホームケアまきの介護事務求人</h4>
                      <p className="text-xs text-gray-600 mb-1">正職員 月給 231,000円 ～ 245,000円</p>
                      <p className="text-xs text-gray-600 mb-2">東京都文京区千駄木3-42-5 セントラルガーデン</p>
                      <Badge variant="secondary" className="text-xs">
                        職場の環境
                      </Badge>
                    </div>
                  </div>

                  {/* Related Job 2 */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Image
                      src="/placeholder.svg?height=60&width=80"
                      alt="SmartWorX"
                      width={80}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">株式会社SmartWorXの外資系求人</h4>
                      <p className="text-xs text-gray-600 mb-1">正職員 月給 250,000円 ～ 300,000円</p>
                      <p className="text-xs text-gray-600 mb-2">東京都中田区谷中大手町7丁目2-5 ダイヤモンド</p>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          職場の環境
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          1日の求人
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Related Job 3 */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Image
                      src="/placeholder.svg?height=60&width=80"
                      alt="PDハウス中野日高"
                      width={80}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">
                        PDハウス中野日高（医療）/ 株式会社サンウェルズ
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">正職員 月給 220,000円 ～</p>
                      <p className="text-xs text-gray-600 mb-2">東京都中野区谷中二丁目1番地東京予定</p>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          車通勤可能
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          オープン3年以内
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" className="w-full text-teal-600 mt-4">
                  求人をもっと見る
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

      <div ref={footerRef} />

      {showCta && (
        <div className="fixed bottom-0 inset-x-0 bg-red-500 text-white z-50 py-3 flex justify-center shadow-lg">
          <Link href={`/apply/${jobId}`} className="px-8 py-2 font-semibold">
            応募画面へ進む
          </Link>
        </div>
      )}
    </div>
  )
}

