import Link from "next/link"
import type { Tag } from "@/features/master/types"
import styles from "./popular-tags-section.module.css"

interface PopularTagsSectionProps {
  tags: Tag[]
}

export default function PopularTagsSection({ tags }: PopularTagsSectionProps) {
  return (
    <section className={styles.section} aria-label="人気のキーワードから探す">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleBar} aria-hidden="true" />
            人気の<span className={styles.titleHi}>キーワード</span>から探す
          </h2>
          <span className={styles.sticker}>HOT!</span>
        </div>

        <div className={styles.tags}>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/search?tags=${encodeURIComponent(tag.id)}`}
              className={styles.tag}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
