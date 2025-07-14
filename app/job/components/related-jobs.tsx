import JobCard from "@/components/job-card"
import type { Job } from "@/lib/types"

interface RelatedJobsProps {
  jobs: Job[]
  title?: string
}

export default function RelatedJobs({ jobs, title = "関連求人" }: RelatedJobsProps) {
  if (jobs.length === 0) {
    return null
  }

  return (
    <section className="mt-16 mb-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  )
} 