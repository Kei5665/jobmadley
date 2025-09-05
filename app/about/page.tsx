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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E9F3FF] via-[#EAF1FF] to-[#DDEBFF]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col lg:flex-row items-center gap-8">
          {/* Left texts */}
          <div className="w-full lg:w-[560px]">
            <p className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold leading-tight text-black">
              タクシーの採用
            </p>
            <div className="mt-3">
              <span className="inline-block bg-white shadow-sm rounded-md px-4 py-2 text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold text-[#2204DB]">
                採用コストゼロ
              </span>
              <span className="ml-2 text-[28px] sm:text-[32px] lg:text-[36px] font-bold">から</span>
            </div>
            <p className="mt-3 text-[28px] sm:text-[32px] lg:text-[36px] font-bold">始められる</p>
            <p className="mt-4 text-sm text-gray-600">採用から定着まで、タクシー業界に寄り添う支援</p>

            <div className="mt-6">
              <Link href="https://ridejob.pmagent.jp/" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#2204DB] hover:bg-[#1C03BD] text-white px-6 py-6 rounded-2xl text-base">
                  お問い合わせはこちら
                </Button>
              </Link>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative w-full lg:flex-1 h-[260px] sm:h-[320px] lg:h-[360px]">
            <Image
              src="/images/about-hero-top-img.png"
              alt=""
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Intro */}
          <p className="text-sm leading-relaxed mb-8">
            ライドジョブ（RIDE JOB）は、ドライバー・運転職に携わるすべての人のキャリアに寄り添い、
            安心して働ける職場との出会いを支援する求人・転職サービスです。求人の応募から入職まで、専任のキャリアアドバイザーがサポートします。
          </p>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}


