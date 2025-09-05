import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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

          {/* CTA Buttons (Desktop) */}
          <div className="hidden md:flex space-x-3 items-center">
            <a href="https://ridejob.pmagent.jp/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#05AADB] hover:bg-[#0399C6] text-white px-4 py-2 text-sm rounded">
                まずお話を聞く
              </Button>
            </a>
            <Link href="/search">
              <Button className="bg-[#1600FF] hover:bg-[#0E00D1] text-white px-4 py-2 text-sm rounded">
                求人情報を見る
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button aria-label="メニュー" variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-6">
                <SheetHeader>
                  <SheetTitle className="sr-only">メニュー</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-8">
                  <a href="https://ridejob.pmagent.jp/" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#05AADB] hover:bg-[#0399C6] text-white">
                      まずお話を聞く
                    </Button>
                  </a>
                  <Link href="/search">
                    <Button className="w-full bg-[#1600FF] hover:bg-[#0E00D1] text-white mt-4">
                      求人情報を見る
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
} 