import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { isNew, formatSalary, formatDate } from "@/lib/utils"
import type { JobDetail } from "@/lib/types"

interface JobTitleActionsProps {
  job: JobDetail
  applyUrl?: string
  isStandby?: boolean
}

export default function JobTitleActions({ job, applyUrl, isStandby = false }: JobTitleActionsProps) {
  const isNewJob = isNew(job.publishedAt, job.createdAt)
  const salaryText = formatSalary(job.salaryMin, job.salaryMax)

  return (
    <div className="mb-8">
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="sm:flex-1">
          <div className="flex items-center mb-2">
            {isNewJob && <Badge className="bg-red-500 text-white mr-2">NEW</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {job.jobName ?? job.title}
          </h1>
          {job.companyName ? (
            <Link href="#" className="text-blue-600 hover:underline">
              {job.companyName}
            </Link>
          ) : (
            <span className="text-gray-700">会社情報なし</span>
          )}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {job.tags.map((tag) => (
                <Badge key={tag.id} className="bg-gray-100 text-gray-600" variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="hidden sm:flex sm:w-auto flex-col space-y-3 sm:ml-6">
          <Link
            href={applyUrl ?? `/apply/${job.id}`}
            className="block w-full sm:w-auto"
            prefetch={!isStandby}
          >
            <Button className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
              応募画面へ進む
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg inline-block mb-4">
        {salaryText}
      </div>
      
      {job.updatedAt && (
        <p className="text-sm text-gray-500">
          最終更新日 {formatDate(job.updatedAt)}
        </p>
      )}
    </div>
  )
} 