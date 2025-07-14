import Image from "next/image"
import Link from "next/link"

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-gray-200 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Logo & description */}
        <div className="max-w-4xl">
          <Image src="/images/logo-ridejob.png" alt="RIDE JOB" width={160} height={40} />
          <p className="text-sm text-gray-600 leading-relaxed mt-6">
            ドライバーの求人をお探しならライドジョブ。あなたにぴったりの求人が見つかります。ドライバー運転・整備・現場職に携わる方々の、転職・就職を支援する求人サイトです。
            全国000件の事業所の正社員 アルバイト パート募集情報を掲載しています。求人の応募から入職まで専任のキャリアが転職をサポートします。転職・就職なら「ライドジョブ」にお任せください。
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">ライドジョブについて</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">会社概要</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">ご利用の流れ</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">お問い合わせ</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">よくある質問</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">サービス</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">求人検索</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">スカウト</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">企業向けサービス</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">採用担当者様</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">法的情報</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-600 hover:text-teal-600">プライバシーポリシー</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">利用規約</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">特定商取引法に基づく表記</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-teal-600">サイトマップ</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 RIDE JOB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 