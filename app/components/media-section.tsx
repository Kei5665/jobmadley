import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { BlogArticle } from "@/lib/types"

interface MediaSectionProps {
  companyArticles: BlogArticle[]
  interviewArticles: BlogArticle[]
}

export default function MediaSection({ companyArticles, interviewArticles }: MediaSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-24">
      <h2 className="text-xl md:text-3xl font-bold mb-8 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3 rounded" />
        ライドジョブ メディア
      </h2>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Interview Column */}
          <div>
            <h3 className="text-2xl font-bold mb-1">企業取材</h3>
            <p className="text-sm text-gray-600 mb-6">職場の雰囲気やスタッフの声を取材し、安心して応募できるリアルな情報！</p>

            <div className="space-y-6">
              {companyArticles.map((article) => {
                const img = article.eyecatch?.url ?? "/placeholder.jpg"
                return (
                  <Link 
                    key={article.id} 
                    href={`https://ridejob.jp/media/blog/${article.slug ?? article.id}`} 
                    target="_blank" 
                    className="block group"
                  >
                    <div className="flex gap-4 items-start border-b border-gray-200">
                      <Image src={img} alt="" width={100} height={80} className="w-24 h-20 object-cover rounded" />
                      <div className="flex-1 pb-4">
                        <div className="flex items-center text-[10px] text-gray-500 gap-2 mb-1">
                          <span className="inline-block bg-indigo-600 text-white px-2 py-0.5 rounded-sm">企業取材</span>
                          <span>{article.publishedAt?.slice(0, 10) ?? ""}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:underline">
                          {article.title}
                        </p>
                        {article.company && <p className="text-xs text-gray-500 mt-1">{article.company}</p>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Voice Column */}
          <div>
            <h3 className="text-2xl font-bold mb-1">ご利用者様の声</h3>
            <p className="text-sm text-gray-600 mb-6">転職活動に役立つノウハウや、現場のリアルな声をお届け！</p>

            <div className="space-y-6">
              {interviewArticles.map((article) => {
                const img = article.eyecatch?.url ?? "/placeholder.jpg"
                return (
                  <Link 
                    key={article.id} 
                    href={`https://ridejob.jp/media/blog/${article.slug ?? article.id}`} 
                    target="_blank" 
                    className="block group"
                  >
                    <div className="flex gap-4 items-start border-b border-gray-200">
                      <Image src={img} alt="" width={100} height={80} className="w-24 h-20 object-cover rounded" />
                      <div className="flex-1 pb-4">
                        <div className="flex items-center text-[10px] text-gray-500 gap-2 mb-1">
                          <span className="inline-block bg-indigo-600 text-white px-2 py-0.5 rounded-sm">ご利用者様の声</span>
                          <span>{article.publishedAt?.slice(0, 10) ?? ""}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:underline">
                          {article.title}
                        </p>
                        {article.company && <p className="text-xs text-gray-500 mt-1">{article.company}</p>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* More button */}
        <div className="text-center mt-12">
          <Link href="https://ridejob.jp/media/" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#2000d8] hover:bg-[#1800b6] text-white px-8 py-4 rounded-full inline-flex items-center gap-2">
              記事をもっと見る
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 外部リンクバナー */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="https://ridejob.jp/ssw/ja" target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src="/images/ssw.png"
            alt="特定技能向け LINE 相談"
            width={768}
            height={279}
            className="w-full h-auto rounded-xl shadow"
          />
        </a>
        <a href="https://www.tiktok.com/@ride.job" target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src="/images/Tiltok.png"
            alt="RIDE JOB TikTok アカウント"
            width={768}
            height={279}
            className="w-full h-auto rounded-xl shadow"
          />
        </a>
        <a href="https://www.youtube.com/@RIDEJOB%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB" target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src="/images/youtube.png"
            alt="RIDE JOB YouTube アカウント"
            width={768}
            height={279}
            className="w-full h-auto rounded-xl shadow"
          />
        </a>
      </div>
    </section>
  )
} 