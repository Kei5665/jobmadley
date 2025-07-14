import { microcmsClient2 } from "@/lib/microcms"
import type { BlogArticle } from "@/lib/types"

export async function getMediaArticles() {
  const fetchArticles = async (categoryId: string) => {
    const data = await microcmsClient2.get<{ contents: BlogArticle[] }>({
      endpoint: "blogs",
      queries: { filters: `category[equals]${categoryId}`, limit: 3, orders: "-publishedAt" },
    })
    return data.contents
  }

  const [companyArticles, interviewArticles] = await Promise.all([
    fetchArticles("2"),
    fetchArticles("5"),
  ])

  return { companyArticles, interviewArticles }
} 