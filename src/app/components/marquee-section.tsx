import styles from "./marquee-section.module.css"

const ITEMS = [
  "✦ タクシードライバー",
  "✦ 自動車整備士",
  "✦ フードデリバリー",
  "✦ 送迎・ハイヤー",
  "✦ トラック・配送",
  "✦ ロードサービス",
  "✦ 未経験歓迎多数",
  "✦ 47都道府県対応",
] as const

export default function MarqueeSection() {
  return (
    <div className={styles.marquee} role="presentation" aria-hidden="true">
      <div className={styles.track}>
        <span>
          {ITEMS.map((t, i) => (
            <span key={`a-${i}`}>
              {t}
              <em className={styles.dot}>●</em>
            </span>
          ))}
        </span>
        <span>
          {ITEMS.map((t, i) => (
            <span key={`b-${i}`}>
              {t}
              <em className={styles.dot}>●</em>
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}
