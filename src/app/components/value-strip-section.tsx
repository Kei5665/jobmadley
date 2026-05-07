import styles from "./value-strip-section.module.css"

const ITEMS = [
  {
    num: "01",
    title: "あなたに合う仕事",
    text: "希望条件×通勤エリア×職種をもとにマッチング。違和感のない求人だけをお届けします。",
  },
  {
    num: "02",
    title: "業界最大級の求人数",
    text: "全国47都道府県をカバー。タクシー・整備士・デリバリーまで、街を支える仕事を網羅。",
  },
  {
    num: "03",
    title: "未経験を全力サポート",
    text: "二種免許取得支援・研修制度ありの求人を多数掲載。プロが入社まで伴走します。",
  },
  {
    num: "04",
    title: "登録は60秒",
    text: "面倒な書類提出は不要。希望条件を入れるだけで、すぐ求人提案が届きます。",
  },
] as const

export default function ValueStripSection() {
  return (
    <section className={styles.section} aria-label="ライドジョブの特徴">
      <div className={styles.grid}>
        {ITEMS.map((it) => (
          <div className={styles.card} key={it.num}>
            <span className={styles.num}>{it.num}</span>
            <h3 className={styles.title}>{it.title}</h3>
            <p className={styles.text}>{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
