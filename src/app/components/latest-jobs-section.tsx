import JobCard from "@/features/jobs/components/job-card"
import type { Job } from "@/features/jobs/types"
import styles from "./latest-jobs-section.module.css"

interface LatestJobsSectionProps {
  jobs: Job[]
}

export default function LatestJobsSection({ jobs }: LatestJobsSectionProps) {
  return (
    <section className={styles.section} aria-label="最新の求人">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleBar} aria-hidden="true" />
            最新の求人
          </h2>
          <span className={styles.sticker}>NEW!</span>
        </div>
        <div className={styles.grid}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
