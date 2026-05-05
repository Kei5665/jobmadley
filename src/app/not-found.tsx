import type { Metadata } from "next"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900">ページが見つかりません</h1>
          <p className="mt-4 text-gray-600">
            URLが変更されたか、掲載が終了した可能性があります。
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/">トップページへ戻る</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
