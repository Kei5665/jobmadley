import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { SITE_DESCRIPTION } from "@/shared/lib/metadata"
import styles from "./site-footer.module.css"

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandRow}>
          <div>
            <div className={styles.logoCard}>
              <Image
                src="/images/logo-ridejob.png"
                alt="RIDE JOB"
                width={180}
                height={46}
                className={styles.logoImage}
              />
            </div>
            <p className={styles.description}>{SITE_DESCRIPTION}</p>
          </div>

          <div className={styles.ctaCard}>
            <span className={styles.ctaSticker}>NOW HIRING</span>
            <h3 className={styles.ctaTitle}>あなたにぴったりの求人を探そう</h3>
            <p className={styles.ctaText}>
              タクシードライバー、自動車整備士、フードデリバリーまで。条件で絞り込んで、あなたに合う仕事を見つけよう。
            </p>
            <Link href="/search" className={styles.ctaButton}>
              求人情報を見る
              <ChevronRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </div>

        <div className={styles.linksGrid}>
          <div>
            <h3 className={styles.colTitle}>ライドジョブについて</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/privacy" className={styles.link}>
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="https://pmagent.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  運営会社情報
                </Link>
              </li>
              <li>
                <Link
                  href="https://ridejob.jp/media/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>運営メディア</h3>
            <ul className={styles.list}>
              <li>
                <Link
                  href="https://ridejob.jp/media/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  ライドジョブ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© RIDE JOB</p>
          <span className={styles.bottomMark}>街を、動かせ。</span>
        </div>
      </div>
    </footer>
  )
}
