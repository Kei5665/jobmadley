import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Briefcase, MapPin } from "lucide-react"
import { formatSalary, formatAddress, getJobImageUrl, isNew } from "@/lib/utils"
import type { JobCardProps } from "@/lib/types"

export default function JobCard({ job, horizontal = false }: JobCardProps) {
  const imageUrl = getJobImageUrl(job.images, job.imageUrl)
  const isNewJob = isNew(job.publishedAt, job.createdAt)
  const salaryText = formatSalary(job.salaryMin, job.salaryMax)
  const addressText = formatAddress(job.municipality?.name, job.prefecture?.region)

  return (
    <Link href={`/job/${job.id}`} className="block group">
      <Card className="rounded-lg shadow-md overflow-hidden group-hover:shadow-lg">
        {horizontal ? (
          <div className="flex flex-col md:flex-row">
            {/* 画像エリア（モバイル: 上部フル幅 / PC: 左サムネ） */}
            <div className="relative w-full h-40 md:h-auto md:w-48 flex-shrink-0">
              <Image
                src={imageUrl}
                alt="求人画像"
                fill
                sizes="(min-width: 768px) 192px, 100vw"
                className="object-cover"
              />
              {isNewJob && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  NEW
                </span>
              )}
            </div>

            {/* 本文 */}
            <CardContent className="p-4 space-y-2 text-sm flex-1">
              {/* タイトル（職務名） */}
              <h2 className="font-semibold text-gray-900 leading-snug line-clamp-2 text-base">
                {job.jobName ?? job.title}
              </h2>

              {/* 会社名 */}
              {job.companyName && (
                <p className="text-xs text-gray-600">{job.companyName}</p>
              )}

              {/* 詳細情報リスト */}
              <ul className="space-y-0.5 list-none">
                {/* 住所 */}
                {addressText && (
                  <li className="flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-gray-700 text-xs">{addressText}</span>
                  </li>
                )}

                {/* 給与 */}
                <li className="flex items-start gap-1">
                  <Wallet className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-gray-700 text-xs">{salaryText}</span>
                </li>

                {/* 雇用形態 */}
                {job.employmentType && (
                  <li className="flex items-start gap-1">
                    <Briefcase className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-gray-700 text-xs">{job.employmentType}</span>
                  </li>
                )}
              </ul>

              {/* タグ */}
              {job.tags && job.tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="border border-gray-300 bg-white text-gray-700 text-[10px] px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {job.tags.length > 3 && (
                      <span className="text-gray-500 text-[10px]">+{job.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        ) : (
          <>
            {/* 画像エリア */}
            <div className="relative">
              <Image
                src={imageUrl}
                alt="求人画像"
                width={320}
                height={180}
                className="w-full h-40 object-cover"
              />
              {isNewJob && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  NEW
                </span>
              )}
            </div>

            {/* 本文 */}
            <CardContent className="p-4 space-y-2 text-sm">
              {/* タイトル（職務名） */}
              <h2 className="font-semibold text-gray-900 leading-snug line-clamp-2 text-base">
                {job.jobName ?? job.title}
              </h2>

              {/* 会社名 */}
              {job.companyName && (
                <p className="text-xs text-gray-600">{job.companyName}</p>
              )}

              {/* 詳細情報リスト */}
              <ul className="space-y-0.5 list-none">
                {/* 住所 */}
                {addressText && (
                  <li className="flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-gray-700 text-xs">{addressText}</span>
                  </li>
                )}

                {/* 給与 */}
                <li className="flex items-start gap-1">
                  <Wallet className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-gray-700 text-xs">{salaryText}</span>
                </li>

                {/* 雇用形態 */}
                {job.employmentType && (
                  <li className="flex items-start gap-1">
                    <Briefcase className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-gray-700 text-xs">{job.employmentType}</span>
                  </li>
                )}
              </ul>

              {/* タグ */}
              {job.tags && job.tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="border border-gray-300 bg-white text-gray-700 text-[10px] px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {job.tags.length > 3 && (
                      <span className="text-gray-500 text-[10px]">+{job.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </Link>
  )
} 