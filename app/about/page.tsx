import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type SymbolMarkProps = {
  type: "circle" | "triangle" | "cross"
  size?: number
  strokeWidth?: number
  className?: string
}

const SymbolMark = ({
  type,
  size = 28,
  strokeWidth = 3,
  className = "",
}: SymbolMarkProps) => {
  const padding = strokeWidth * 1.5
  const half = size / 2

  if (type === "circle") {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        aria-hidden
      >
        <circle
          cx={half}
          cy={half}
          r={half - strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  if (type === "triangle") {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        aria-hidden
      >
        <polygon
          points={`${half},${padding} ${size - padding},${size - padding} ${padding},${size - padding}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // cross
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      <line
        x1={padding}
        y1={padding}
        x2={size - padding}
        y2={size - padding}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={size - padding}
        y1={padding}
        x2={padding}
        y2={size - padding}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: "会社情報",
  description: "ライドジョブを運営する株式会社PM Agentの会社情報ページです。ミッション、事業内容、所在地などをご紹介します。",
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-sky-200 via-blue-200 to-sky-100">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* 左: テキスト画像 + ボタン（ボタンは実体） */}
              <div>
                <Image
                  src="/images/left-text.png"
                  alt="採用コストゼロ から始められる"
                  width={530}
                  height={282}
                  priority
                  className="w-full h-auto max-w-[560px]"
                />
                <div className="mt-6">
                  <Button asChild className="bg-[#2000d8] hover:bg-[#1800b6] text-white rounded-full px-6 py-6 text-base md:text-lg">
                    <Link href="/#contact">お問い合わせはこちら</Link>
                  </Button>
                </div>
              </div>

              {/* 右: 画像セクション（画像ファイル） */}
              <div className="md:justify-self-end">
                <Image
                  src="/images/right-img.png"
                  alt="採用サービスのイメージ"
                  width={620}
                  height={427}
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* お問い合わせ セクション */}
        <section id="contact" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <p className="text-center text-sm md:text-base text-neutral-700">
              ご質問や不明点等ございましたら、以下のフォームよりお気軽にお問い合わせください
            </p>
            <h2 className="mt-3 text-center text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              お問い合わせ
            </h2>

            <div className="mt-10 rounded-3xl bg-sky-50 p-4 md:p-8">
              <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 ring-1 ring-neutral-200/70">
                <form action="#" method="post" className="space-y-6">
                  {/* 会社名（必須） */}
                  <div>
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <span>会社名</span>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
                    </Label>
                    <Input id="company" name="company" required aria-required className="mt-2" />
                  </div>

                  {/* ご担当者名（必須） */}
                  <div>
                    <Label htmlFor="contactName" className="flex items-center gap-2">
                      <span>ご担当者名</span>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
                    </Label>
                    <Input id="contactName" name="contactName" required aria-required className="mt-2" />
                  </div>

                  {/* 会社のメールアドレス（必須） */}
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <span>会社のメールアドレス</span>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
                    </Label>
                    <Input id="email" name="email" type="email" required aria-required className="mt-2" />
                  </div>

                  {/* 電話番号（必須） */}
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <span>電話番号</span>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
                    </Label>
                    <Input id="phone" name="phone" type="tel" required aria-required className="mt-2" />
                  </div>

                  {/* お問い合わせ内容（必須・選択） */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <span>お問い合わせ内容</span>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">必須</span>
                    </Label>
                    <div className="mt-2">
                      <Select>
                        <SelectTrigger aria-label="お問い合わせ内容を選択">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consult">採用について相談したい</SelectItem>
                          <SelectItem value="service">サービス内容を知りたい</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* お問い合わせ詳細（自由記述） */}
                  <div>
                    <Label htmlFor="detail">お問い合わせ詳細（自由記述）</Label>
                    <Textarea id="detail" name="detail" className="mt-2 min-h-[140px]" placeholder="ご相談内容・ご要望などをご記入ください" />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full rounded-2xl bg-[#1f1fff] hover:bg-[#1800b6] text-white py-6 text-base md:text-lg">
                      送信
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 採用課題セクション */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
          <div className="mx-auto max-w-6xl px-4 pt-14 pb-28 md:pt-20 md:pb-36">
            <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              こんな<strong className="text-[#1f1fff]">採用課題</strong>はありませんか？
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 items-end">
              {/* 01 */}
              <div className="flex justify-center">
                <Image
                  src="/images/Feature Content1.png"
                  alt="課題01 応募が集まらない"
                  width={358}
                  height={270}
                  className="w-full max-w-[360px] h-auto drop-shadow-md"
                  priority
                />
              </div>

              {/* 02 (中央は少し大きく) */}
              <div className="flex justify-center">
                <Image
                  src="/images/Feature Content 2.png"
                  alt="課題02 デジタル運用ができていない"
                  width={380}
                  height={286}
                  className="w-full max-w-[400px] h-auto drop-shadow-xl"
                  priority
                />
              </div>

              {/* 03 */}
              <div className="flex justify-center">
                <Image
                  src="/images/Feature Content3.png"
                  alt="課題03 ミスマッチが多い"
                  width={358}
                  height={270}
                  className="w-full max-w-[360px] h-auto drop-shadow-md"
                  priority
                />
              </div>
            </div>

            {/* 下部の人物画像（重ね） */}
            <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/3 md:translate-y-1/4">
              <Image
                src="/images/Feature Images human.png"
                alt="悩む人"
                width={420}
                height={280}
                sizes="(min-width: 768px) 300px, 180px"
                quality={95}
                className="w-[180px] md:w-[300px] h-auto"
                priority
              />
            </div>
          </div>
        </section>

        {/* RIDE JOB の特徴 */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              RIDE JOBの特徴
            </h2>

            {/* Feature 01 */}
            <div className="mt-10 md:mt-14 rounded-2xl bg-blue-50/60 p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                <div>
                  <p className="text-[#1f1fff] text-4xl md:text-5xl font-extrabold leading-none">01</p>
                  <h3 className="mt-3 text-xl md:text-2xl font-bold text-neutral-900">
                    業界特化の採用
                    <br className="hidden md:block" />
                    マーケティングで母集団形成
                  </h3>
                  <p className="mt-4 text-sm md:text-base text-neutral-700 leading-relaxed">
                    タクシー・整備士業界に特化した求人・転職メディアとSNSマーケティングで業界の魅力を発信し、候補者を惹きつけます。
                    施策の組み合わせで効率的にリーチし、応募母集団を安定的に形成します。
                  </p>
                </div>
                <div className="justify-self-center md:justify-self-end">
                  <Image
                    src="/images/feature1.png"
                    alt="母集団形成のイメージ"
                    width={434}
                    height={416}
                    className="w-full max-w-[420px] h-auto rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Feature 02 */}
            <div className="mt-8 md:mt-10 rounded-2xl bg-blue-50/60 p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                <div className="order-2 md:order-1">
                  <Image
                    src="/images/feature2.png"
                    alt="専任コンサルタントの面談支援"
                    width={434}
                    height={416}
                    className="w-full max-w-[420px] h-auto rounded-2xl"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-[#1f1fff] text-4xl md:text-5xl font-extrabold leading-none">02</p>
                  <h3 className="mt-3 text-xl md:text-2xl font-bold text-neutral-900">
                    専任コンサルタント
                    <br className="hidden md:block" />
                    による面談・定着支援
                  </h3>
                  <p className="mt-4 text-sm md:text-base text-neutral-700 leading-relaxed">
                    求人票作成から面談対応まで伴走。応募者体験と歩留まりを改善し、データに基づく採用運用で効果を最大化します。
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 03 */}
            <div className="mt-8 md:mt-10 rounded-2xl bg-blue-50/60 p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                <div>
                  <p className="text-[#1f1fff] text-4xl md:text-5xl font-extrabold leading-none">03</p>
                  <h3 className="mt-3 text-xl md:text-2xl font-bold text-neutral-900">
                    成果報酬モデル × 実績300社以上で安心
                  </h3>
                  <p className="mt-4 text-sm md:text-base text-neutral-700 leading-relaxed">
                    実績に裏付けられた支援体制で、ムダなコストを抑えつつ最適な採用を実現。ミスマッチを防ぎ、定着につなげます。
                  </p>
                </div>
                <div className="justify-self-center md:justify-self-end">
                  <Image
                    src="/images/feature3.png"
                    alt="300社の実績イメージ"
                    width={434}
                    height={416}
                    className="w-full max-w-[420px] h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 他社採用サービス比較 */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              他社採用サービス比較
            </h2>

            <div className="mt-10 overflow-x-auto">
              <table className="min-w-[960px] w-full text-sm md:text-base border border-neutral-200 rounded-2xl overflow-hidden">
                <thead>
                  <tr className="text-neutral-900">
                    <th className="bg-neutral-50 text-left align-middle font-semibold p-4 md:p-5 w-36">項目</th>
                    <th className="bg-blue-50/70 p-4 md:p-5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="rounded-xl bg-blue-100 text-[#1f1fff] font-bold px-3 py-1">RIDE JOB</span>
                        <span className="text-xs text-neutral-600">ライドジョブ</span>
                      </div>
                    </th>
                    <th className="bg-white p-4 md:p-5 text-center font-semibold">人材紹介</th>
                    <th className="bg-white p-4 md:p-5 text-center font-semibold">ハローワーク</th>
                    <th className="bg-white p-4 md:p-5 text-center font-semibold">掲載型求人媒体</th>
                  </tr>
                </thead>
                <tbody className="[&_tr]:border-t [&_tr]:border-neutral-200">
                  {/* 料金 */}
                  <tr>
                    <th className="bg-neutral-50 text-left align-top font-semibold p-4 md:p-5">料金</th>
                    <td className="bg-blue-50/70 p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <span className="text-[#1f1fff]"><SymbolMark type="circle" size={36} strokeWidth={4} /></span>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          成果報酬型（採用決定時のみ費用発生）
                        </p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">紹介料が高額</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="circle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">無料</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          掲載課金制（固定費用）
                        </p>
                      </div>
                    </td>
                  </tr>

                  {/* 母体形成方法 */}
                  <tr>
                    <th className="bg-neutral-50 text-left align-top font-semibold p-4 md:p-5">母体形成方法</th>
                    <td className="bg-blue-50/70 p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <span className="text-[#1f1fff]"><SymbolMark type="circle" size={36} strokeWidth={4} /></span>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          独自メディア・求人サイト＋Indeedなどのデジタル広告連携
                        </p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">自社データベースに依存</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">来所者・利用者中心</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">媒体ユーザーに依存</p>
                      </div>
                    </td>
                  </tr>

                  {/* 採用工数 */}
                  <tr>
                    <th className="bg-neutral-50 text-left align-top font-semibold p-4 md:p-5">採用工数</th>
                    <td className="bg-blue-50/70 p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <span className="text-[#1f1fff]"><SymbolMark type="circle" size={36} strokeWidth={4} /></span>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          専任コンサルが候補者面談・選考調整を代行
                        </p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">調整代行あり</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">企業側で選考調整が必要</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">企業側で選考調整が必要</p>
                      </div>
                    </td>
                  </tr>

                  {/* 定着支援 */}
                  <tr>
                    <th className="bg-neutral-50 text-left align-top font-semibold p-4 md:p-5">定着支援</th>
                    <td className="bg-blue-50/70 p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <span className="text-[#1f1fff]"><SymbolMark type="circle" size={36} strokeWidth={4} /></span>
                        <p className="text-xs text-neutral-700 leading-relaxed">入社前後のフォローあり</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="triangle" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">企業によりフォロー有無が異なる</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="cross" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">フォローはほぼ無し</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5">
                      <div className="flex flex-col items-center text-center gap-2">
                        <SymbolMark type="cross" size={36} strokeWidth={4} />
                        <p className="text-xs text-neutral-700 leading-relaxed">フォローは無し</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ セクション */}
        <section className="bg-sky-50">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="rounded-3xl bg-white p-6 md:p-10 shadow-sm ring-1 ring-neutral-200/60">
              <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
                よくあるご質問
              </h2>

              <div className="mt-8 divide-y divide-neutral-200">
                {/* Q1 */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 py-6 md:py-7">
                  <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#1f1fff] text-white flex items-center justify-center font-bold">Q</div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm md:text-base">本当に応募者は集まるのでしょうか？</p>
                    <p className="mt-2 text-xs md:text-sm text-neutral-700 leading-relaxed">
                      ライドジョブはタクシー・自動車整備業界に特化した求人メディアと人材紹介を組み合わせ、Indeedなどの大手求人媒体やSNS広告も活用しています。そのため、一般的な求人媒体よりも応募者の母集団形成に強みがあります。
                    </p>
                  </div>
                  <div className="text-neutral-400 select-none">—</div>
                </div>

                {/* Q2 */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 py-6 md:py-7">
                  <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#1f1fff] text-white flex items-center justify-center font-bold">Q</div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm md:text-base">採用活動の工数削減にもつながりますか？</p>
                    <p className="mt-2 text-xs md:text-sm text-neutral-700 leading-relaxed">
                      はい。専任コンサルタントが候補者との面談調整やフォローを担うため、企業様は選考や面談に集中できます。人事担当者の負担を大幅に軽減しながら効率的に採用活動を進められます。
                    </p>
                  </div>
                  <div className="text-neutral-400 select-none">—</div>
                </div>

                {/* Q3 */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 py-6 md:py-7">
                  <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#1f1fff] text-white flex items-center justify-center font-bold">Q</div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm md:text-base">外国人材の採用にも対応できますか？</p>
                    <p className="mt-2 text-xs md:text-sm text-neutral-700 leading-relaxed">
                      可能です。タクシー運転手や自動車整備士の分野では特定技能人材の採用が進んでおり、ライドジョブは海外連携ネットワークや国関連対応の情報提供も行っています。グローバル人材の採用も安心してお任せください。
                    </p>
                  </div>
                  <div className="text-neutral-400 select-none">—</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 md:mt-20">
              <h3 className="text-center text-xl md:text-2xl font-bold text-neutral-900">今すぐ採用活動を始めましょう</h3>
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* CTA Left: contact button */}
                <div className="rounded-3xl bg-white p-6 md:p-8 ring-1 ring-neutral-200/70 text-center">
                  <p className="text-xs md:text-sm text-neutral-700">無料で求人掲載スタート！</p>
                  <div className="mt-4">
                    <Button asChild className="w-full rounded-2xl bg-[#1f1fff] hover:bg-[#1800b6] text-white text-base md:text-lg py-6">
                      <Link href="/#contact" className="flex items-center justify-center gap-2">
                        無料相談はこちら
                        <span aria-hidden>›</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* CTA Right: phone */}
                <div className="rounded-3xl bg-white p-6 md:p-8 ring-1 ring-neutral-200/70 text-center">
                  <p className="text-sm md:text-base text-[#1f1fff]">電話で相談する</p>
                  <p className="mt-3 text-2xl md:text-4xl font-extrabold tracking-wide text-[#1f1fff]">03-6824-7476</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}


