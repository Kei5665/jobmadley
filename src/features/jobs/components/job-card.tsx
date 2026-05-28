import Image from "next/image"
import Link from "next/link"
import { Wallet, Briefcase, MapPin } from "lucide-react"
import { formatSalary, formatAddress, getJobImageUrl, isNew } from "@/shared/lib/utils"
import type { Job } from "@/features/jobs/types"
import styles from "./job-card.module.css"

interface JobCardProps {
  job: Job
  horizontal?: boolean
}

export default function JobCard({ job, horizontal = false }: JobCardProps) {
  const imageUrl = getJobImageUrl(job.images, job.imageUrl)
  const isNewJob = isNew(job.publishedAt, job.createdAt)
  const salaryText = formatSalary(job.salaryMin, job.salaryMax, job.wageType)
  const addressText = formatAddress(job.municipality?.name, job.prefecture?.region)

  const cardClass = horizontal
    ? `${styles.card} ${styles.horizontal}`
    : styles.card

  return (
    <Link href={`/job/${job.id}`} className={cardClass}>
      <div className={styles.imageWrap}>
        <Image
          src={imageUrl}
          alt="求人画像"
          fill
          sizes={horizontal ? "(min-width: 768px) 220px, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          className={styles.image}
        />
        {isNewJob && <span className={styles.newBadge}>NEW</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{job.jobName ?? job.title}</h3>

        {job.companyName && <p className={styles.companyName}>{job.companyName}</p>}

        <ul className={styles.metaList}>
          {addressText && (
            <li className={styles.metaItem}>
              <MapPin className={styles.metaIcon} />
              <span>{addressText}</span>
            </li>
          )}
          <li className={styles.metaItem}>
            <Wallet className={styles.metaIcon} />
            <span>{salaryText}</span>
          </li>
          {job.employmentType && job.employmentType.length > 0 && (
            <li className={styles.metaItem}>
              <Briefcase className={styles.metaIcon} />
              <span>{job.employmentType.join(" / ")}</span>
            </li>
          )}
        </ul>

        {job.tags && job.tags.length > 0 && (
          <div className={styles.tags}>
            {job.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className={styles.tag}>
                {tag.name}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className={styles.tagMore}>+{job.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
