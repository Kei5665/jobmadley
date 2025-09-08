import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"

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

      </main>

      <SiteFooter />
    </div>
  )
}


