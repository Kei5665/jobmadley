import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import type { JobDetail } from "@/lib/types"

interface JobBreadcrumbProps {
  job: JobDetail
}

export default function JobBreadcrumb({ job }: JobBreadcrumbProps) {
  const jobCategoryName = job.jobCategory?.name
  const prefectureId = job.prefecture?.id ?? ""
  const prefectureName = job.prefecture?.region ?? ""
  const municipalityId = job.municipality?.id ?? ""
  const municipalityName = job.municipality?.name ?? ""
  const companyName = job.companyName ?? ""

  const lastCrumbText = companyName && jobCategoryName
    ? `${companyName}の${jobCategoryName}求人`
    : companyName
      ? `${companyName}の求人`
      : jobCategoryName
        ? `${jobCategoryName}求人`
        : "求人詳細"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-600 sm:gap-2">
        <Home className="w-5 h-5 mr-1 shrink-0 sm:w-4 sm:h-4" />
        {prefectureId && (
          <>
            <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
            <Link href={`/search?prefecture=${prefectureId}`} className="hover:text-blue-600 whitespace-nowrap">
              {prefectureName}
            </Link>
          </>
        )}
        {municipalityId && (
          <>
            <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
            <Link href={`/search?prefecture=${prefectureId}&municipality=${municipalityId}`} className="hover:text-blue-600 whitespace-nowrap">
              {municipalityName}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
        <span className="flex-1 min-w-0 whitespace-normal break-words">{lastCrumbText}</span>
      </div>
    </div>
  )
} 