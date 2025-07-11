import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Briefcase, MapPin } from "lucide-react"
import type { Job } from "@/lib/getJobs"

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const imageUrl = job.images?.[0]?.url ?? job.imageUrl ?? "/placeholder.svg"

  // ＮＥＷ バッジは公開日または作成日が 7 日以内の場合に表示（createdAt は depth=1 では取得できないが保険で判定）
  const publishedDateStr = (job as any).publishedAt ?? (job as any).createdAt
  const isNew = publishedDateStr
    ? Date.now() - new Date(publishedDateStr).getTime() < 7 * 24 * 60 * 60 * 1000
    : false

  const salaryText = (() => {
    if (job.salaryMin && job.salaryMax)
      return `月給 ${job.salaryMin.toLocaleString()}円 ~ ${job.salaryMax.toLocaleString()}円`
    if (job.salaryMin) return `月給 ${job.salaryMin.toLocaleString()}円〜`
    if (job.salaryMax) return `月給 〜${job.salaryMax.toLocaleString()}円`
    return "給与情報なし"
  })()

  const addressText = [job.municipality?.name, job.prefecture?.region]
    .filter(Boolean)
    .join(" ")

  return (
    <Link href={`/job/${job.id}`} className="block group">
      <Card className="rounded-lg shadow-md overflow-hidden group-hover:shadow-lg">
        {/* 画像エリア */}
        <div className="relative">
          <Image
            src={imageUrl}
            alt="求人画像"
            width={320}
            height={180}
            className="w-full h-40 object-cover"
          />
          {isNew && (
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
          {(job as any).companyName && (
            <p className="text-xs text-gray-600">{(job as any).companyName}</p>
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
            {(job as any).employmentType && (
              <li className="flex items-start gap-1">
                <Briefcase className="w-4 h-4 text-blue-600 mt-0.5" />
                <span className="text-gray-700 text-xs">{(job as any).employmentType}</span>
              </li>
            )}
          </ul>

          {/* タグ */}
          {job.tags && job.tags.length > 0 && (
            <div className="pt-2">
              <div className="flex flex-wrap gap-1">
                {job.tags.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className="border border-gray-300 bg-white text-gray-700 text-[10px] px-2 py-0.5 rounded"
                  >
                    {t.name}
                  </span>
                ))}
                {job.tags.length > 3 && (
                  <span className="text-gray-500 text-[10px]">+{job.tags.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 