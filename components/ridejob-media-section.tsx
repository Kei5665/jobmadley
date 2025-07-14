import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { BlogArticle } from "@/lib/types"

interface RidejobMediaSectionProps {
  companyArticles: BlogArticle[]
  interviewArticles: BlogArticle[]
}

export default function RidejobMediaSection({ companyArticles, interviewArticles }: RidejobMediaSectionProps) {
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
              {companyArticles.map((a) => {
                const img = a.eyecatch?.url ?? "/placeholder.jpg"
                return (
                  <Link key={a.id} href={`https://ridejob-cms.vercel.app/blogs/${a.slug ?? a.id}`} target="_blank" className="block group">
                    <div className="flex gap-4 items-start border-b border-gray-200">
                      <Image src={img} alt="" width={100} height={80} className="w-24 h-20 object-cover rounded" />
                      <div className="flex-1 pb-4">
                        <div className="flex items-center text-[10px] text-gray-500 gap-2 mb-1">
                          <span className="inline-block bg-indigo-600 text-white px-2 py-0.5 rounded-sm">企業取材</span>
                          <span>{a.publishedAt?.slice(0, 10) ?? ""}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:underline">
                          {a.title}
                        </p>
                        {a.company && <p className="text-xs text-gray-500 mt-1">{a.company}</p>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Interview Column */}
          <div>
            <h3 className="text-2xl font-bold mb-1">インタビュー</h3>
            <p className="text-sm text-gray-600 mb-6">転職活動に役立つノウハウや、現場のリアルな声を交えた業界情報をお届け！</p>

            <div className="space-y-6">
              {interviewArticles.map((a) => {
                const img = a.eyecatch?.url ?? "/placeholder.jpg"
                return (
                  <Link key={a.id} href={`https://ridejob-cms.vercel.app/blogs/${a.slug ?? a.id}`} target="_blank" className="block group">
                    <div className="flex gap-4 items-start border-b border-gray-200">
                      <Image src={img} alt="" width={100} height={80} className="w-24 h-20 object-cover rounded" />
                      <div className="flex-1 pb-4">
                        <div className="flex items-center text-[10px] text-gray-500 gap-2 mb-1">
                          <span className="inline-block bg-indigo-600 text-white px-2 py-0.5 rounded-sm">インタビュー</span>
                          <span>{a.publishedAt?.slice(0, 10) ?? ""}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:underline">
                          {a.title}
                        </p>
                        {a.company && <p className="text-xs text-gray-500 mt-1">{a.company}</p>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* more button */}
        <div className="text-center mt-12">
          <Link href="https://ridejob-cms.online/blogs" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#2000d8] hover:bg-[#1800b6] text-white px-8 py-4 rounded-full inline-flex items-center gap-2">
              記事をもっと見る
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 