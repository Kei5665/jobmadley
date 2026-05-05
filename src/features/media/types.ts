/** ブログ記事 */
export interface BlogArticle {
  id: string
  title: string
  slug?: string
  eyecatch?: { url: string }
  publishedAt?: string
  category?: {
    id: string
    name: string
    slug: string
  }
  content?: string
  html?: string
  company?: string
}
