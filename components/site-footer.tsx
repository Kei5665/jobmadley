'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Logo & description */}
        <div className="max-w-4xl">
          <Image src="/images/logo-ridejob.png" alt="RIDE JOB" width={160} height={40} />
          <p className="text-sm text-gray-600 leading-relaxed mt-6">
            ドライバーの求人をお探しならライドジョブ。あなたにぴったりの求人が見つかります。ドライバー運転・整備・現場職に携わる方々の、転職・就職を支援する求人サイトです。
            全国000件の事業所の正社員 アルバイト パート募集情報を掲載しています（2025年7月31日現在）。求人の応募から入職まで専任のキャリアが転職をサポートします。転職・就職なら「ライドジョブ」にお任せください。
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">ライドジョブについて</h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li><Link href="#" className="hover:underline">ご利用規約</Link></li>
              <li><Link href="#" className="hover:underline">ミッション</Link></li>
              <li><Link href="#" className="hover:underline">転職体験談</Link></li>
              <li><Link href="/privacy" className="hover:underline">プライバシーポリシー</Link></li>
              <li><Link href="https://pmagent.jp/" target="_blank" rel="noopener noreferrer" className="hover:underline">運営会社情報</Link></li>
              <li><Link href="#" className="hover:underline">お問い合わせ</Link></li>
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h3 className="font-bold text-lg mb-4">採用担当者様へ</h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li><Link href="#" className="hover:underline">求人掲載をお考えの企業様</Link></li>
            </ul>
          </div>

          {/* Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">運営メディア</h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li><Link href="https://ridejob-cms.online/blogs" target="_blank" className="hover:underline">ライドジョブ</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact button */}
        <div className="text-center md:text-left">
          <Link href="#" className="inline-block">
            <Button className="bg-[#2000d8] hover:bg-[#1800b6] text-white px-8 py-4 rounded-full inline-flex items-center gap-2">
              各種ご相談 お問い合わせ窓口
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  )
} 