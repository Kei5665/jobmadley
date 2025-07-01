import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { microcmsClient2 } from "@/lib/microcms"

interface BlogArticle {
  id: string
  title: string
  slug?: string
  eyecatch?: { url: string }
}

/**
 * なるほど！ジョブメドレー新着記事セクション
 * トップページ・検索結果ページで共通利用
 */
export default async function MediaArticlesSection() {
  const data = await microcmsClient2.get<{ contents: BlogArticle[] }>({
    endpoint: "blogs",
    queries: { limit: 4, orders: "-publishedAt" },
  })
  const articles = data.contents

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">なるほど！ジョブメドレー新着記事</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {articles.map((article) => {
            const img = article.eyecatch?.url ?? "/placeholder.jpg"
            return (
              <Card key={article.id} className="overflow-hidden">
                <Image src={img} alt="" width={300} height={200} className="w-full h-48 object-cover" />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                  <Link
                    href={`https://ridejob-cms.vercel.app/blogs/${article.slug ?? article.id}`}
                    className="text-teal-600 text-sm hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    記事を読む
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="text-center">
          <Link
            href="https://ridejob-cms.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
              なるほど！ジョブメドレーをもっと見る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 