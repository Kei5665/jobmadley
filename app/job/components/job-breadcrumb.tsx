import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import type { JobDetail } from "@/lib/types"

interface JobBreadcrumbProps {
  job: JobDetail
}

export default function JobBreadcrumb({ job }: JobBreadcrumbProps) {
  const jobCategoryName = job.jobCategory?.name ?? "職種未設定"
  const prefectureId = job.prefecture?.id ?? ""
  const prefectureName = job.prefecture?.region ?? ""
  const municipalityId = job.municipality?.id ?? ""
  const municipalityName = job.municipality?.name ?? ""
  const companyName = job.companyName ?? "会社名未設定"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center text-sm text-gray-600">
        <Home className="w-4 h-4 mr-1" />
        <ChevronRight className="w-4 h-4 mx-1" />
    <Link href="/" className="hover:text-blue-600">
          {jobCategoryName}の求人
        </Link>
        {prefectureId && (
          <>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href={`/search?prefecture=${prefectureId}`} className="hover:text-blue-600">
              {prefectureName}
            </Link>
          </>
        )}
        {municipalityId && (
          <>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href={`/search?prefecture=${prefectureId}&municipality=${municipalityId}`} className="hover:text-blue-600">
              {municipalityName}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4 mx-1" />
        <span>{`${companyName}の${jobCategoryName}求人`}</span>
      </div>
    </div>
  )
} 