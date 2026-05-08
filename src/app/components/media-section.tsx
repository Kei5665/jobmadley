import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { BlogArticle } from "@/features/media/types"
import styles from "./media-section.module.css"

interface MediaSectionProps {
  companyArticles: BlogArticle[]
  interviewArticles: BlogArticle[]
}

interface ArticleColumnProps {
  title: string
  description: string
  badgeLabel: string
  badgeAlt?: boolean
  articles: BlogArticle[]
}

function ArticleColumn({ title, description, badgeLabel, badgeAlt, articles }: ArticleColumnProps) {
  return (
    <div>
      <div className={styles.colHeader}>
        <h3 className={styles.colTitle}>{title}</h3>
        <p className={styles.colDesc}>{description}</p>
      </div>
      <div className={styles.articles}>
        {articles.map((article) => {
          const img = article.eyecatch?.url ?? "/placeholder.jpg"
          return (
            <Link
              key={article.id}
              href={`https://ridejob.jp/media/blog/${article.slug ?? article.id}`}
              target="_blank"
              className={styles.articleLink}
            >
              <div className={styles.thumbWrap}>
                <Image src={img} alt="" fill sizes="96px" className={styles.thumb} />
              </div>
              <div className={styles.articleBody}>
                <div className={styles.articleMeta}>
                  <span className={`${styles.categoryBadge} ${badgeAlt ? styles.alt : ""}`}>{badgeLabel}</span>
                  <span className={styles.date}>{article.publishedAt?.slice(0, 10) ?? ""}</span>
                </div>
                <p className={styles.articleTitle}>{article.title}</p>
                {article.company && <p className={styles.companyName}>{article.company}</p>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function MediaSection({ companyArticles, interviewArticles }: MediaSectionProps) {
  return (
    <section className={styles.section} aria-label="ライドジョブ メディア">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleBar} aria-hidden="true" />
            ライドジョブ メディア
          </h2>
          <span className={styles.sticker}>MEDIA</span>
        </div>

        <div className={styles.container}>
          <div className={styles.columns}>
            <ArticleColumn
              title="企業取材"
              description="職場の雰囲気やスタッフの声を取材し、安心して応募できるリアルな情報！"
              badgeLabel="企業取材"
              articles={companyArticles}
            />
            <ArticleColumn
              title="ご利用者様の声"
              description="転職活動に役立つノウハウや、現場のリアルな声をお届け！"
              badgeLabel="ご利用者様の声"
              badgeAlt
              articles={interviewArticles}
            />
          </div>

          <div className={styles.moreWrap}>
            <Link
              href="https://ridejob.jp/media/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.moreButton}
            >
              記事をもっと見る
              <ChevronRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </div>

        <div className={styles.banners}>
          <a href="https://ridejob.jp/ssw/ja" target="_blank" rel="noopener noreferrer" className={styles.banner}>
            <Image
              src="/images/ssw.png"
              alt="特定技能向け LINE 相談"
              width={768}
              height={279}
              className={styles.bannerImage}
            />
          </a>
          <a href="https://www.tiktok.com/@ride.job" target="_blank" rel="noopener noreferrer" className={styles.banner}>
            <Image
              src="/images/Tiltok.png"
              alt="RIDE JOB TikTok アカウント"
              width={768}
              height={279}
              className={styles.bannerImage}
            />
          </a>
          <a
            href="https://www.youtube.com/@RIDEJOB%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.banner}
          >
            <Image
              src="/images/youtube.png"
              alt="RIDE JOB YouTube アカウント"
              width={768}
              height={279}
              className={styles.bannerImage}
            />
          </a>
        </div>
      </div>
    </section>
  )
}
