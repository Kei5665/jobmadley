import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// サーバーコンポーネント
export default function SiteHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo-ridejob.png" alt="RIDE JOB" width={120} height={32} />
          </Link>

          {/* CTA Buttons */}
          <div className="flex space-x-3">
            <Link href="/contact">
              <Button className="bg-[#05AADB] hover:bg-[#0399C6] text-white px-4 py-2 text-sm rounded">
                まずお話を聞く
              </Button>
            </Link>
            <Link href="/search">
              <Button className="bg-[#1600FF] hover:bg-[#0E00D1] text-white px-4 py-2 text-sm rounded">
                求人情報を見る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 