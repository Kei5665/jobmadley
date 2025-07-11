"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Home, ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { JobDetail } from "@/lib/getJob"
import type { Job } from "@/lib/getJobs"

interface BlogArticle {
  id: string;
  title: string;
  slug?: string;
  eyecatch?: { url: string };
}

interface JobDetailPageProps {
  job: JobDetail
  relatedJobs: Job[]
  articles?: BlogArticle[]
}

export default function JobDetailPage({ job, relatedJobs }: JobDetailPageProps) {
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
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {(() => {
          const jobCategoryName = job.jobCategory?.name ?? "職種未設定"
          const prefectureId = job.prefecture?.id ?? ""
          const prefectureName = job.prefecture?.region ?? ""
          const municipalityId = job.municipality?.id ?? ""
          const municipalityName = job.municipality?.name ?? ""
          const companyName = job.companyName ?? "会社名未設定"

          return (
            <div className="flex items-center text-sm text-gray-600">
              <Home className="w-4 h-4 mr-1" />
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link href="/" className="hover:text-teal-600">
                {jobCategoryName}の求人
              </Link>
              {prefectureId && (
                <>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link href={`/search?prefecture=${prefectureId}`} className="hover:text-teal-600">
                    {prefectureName}
                  </Link>
                </>
              )}
              {municipalityId && (
                <>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link href={`/search?prefecture=${prefectureId}&municipality=${municipalityId}`} className="hover:text-teal-600">
                    {municipalityName}
                  </Link>
                </>
              )}
              <ChevronRight className="w-4 h-4 mx-1" />
              <span>{`${companyName}の${jobCategoryName}求人`}</span>
            </div>
          )
        })()}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div>
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
                <p className="text-sm text-gray-500">最終更新日 {new Date(job.updatedAt).toLocaleDateString("ja-JP")}</p>
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
          </div>

          {/* Sidebar removed */}
        </div>
      </div>

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

