import JobCard from "@/components/job-card"
import type { Job } from "@/lib/types"

interface LatestJobsSectionProps {
  jobs: Job[]
}

export default function LatestJobsSection({ jobs }: LatestJobsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-24">
      <h2 className="text-xl md:text-3xl font-bold mb-6 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3 rounded" />
        最新の求人
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  )
} 