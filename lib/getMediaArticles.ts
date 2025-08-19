import { microcmsClient2 } from "@/lib/microcms"
import type { BlogArticle } from "@/lib/types"

export async function getMediaArticles() {
  const fetchArticles = async (categoryId: string) => {
    const data = await microcmsClient2.get<{ contents: BlogArticle[] }>({
      endpoint: "blogs",
      queries: { filters: `category[equals]${categoryId}`, limit: 100, orders: "-publishedAt" },
    })
    return data.contents
  }

  const [companyPool, voicePool] = await Promise.all([
    fetchArticles("2"),
    fetchArticles("3"),
  ])

  const pickThreeRandom = (articles: BlogArticle[]) => {
    const shuffled = [...articles]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, 3)
  }

  return {
    companyArticles: pickThreeRandom(companyPool),
    interviewArticles: pickThreeRandom(voicePool),
  }
} 