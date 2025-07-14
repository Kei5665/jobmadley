import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative mb-12">
      {/* 背景画像 */}
      <div
        className="relative h-[320px] md:h-[380px] lg:h-[420px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/top-bg.png')" }}
      >
        {/* 浮かせた検索ボックス */}
        <div className="absolute left-1/2 bottom-0 translate-y-1/4 -translate-x-1/2 w-full max-w-5xl px-4 z-20">
          <div className="bg-gradient-to-r from-[#1f1fff] via-[#0044ff] to-[#1aa9ff] rounded-xl shadow-2xl">
            <div className="px-6 py-6">
              {/* タイトル画像 */}
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/search-form-text.png"
                  alt="RIDE JOB 全国で求人掲載中！"
                  width={700}
                  height={60}
                  priority
                />
              </div>

              {/* 検索フォーム */}
              <div className="mt-6 flex rounded-md overflow-hidden bg-white">
                <Input
                  placeholder="フリーワード"
                  className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none text-sm"
                />
                <Button
                  className="bg-[#2000d8] hover:bg-[#1800b6] text-white px-8 flex items-center gap-1 rounded-none"
                >
                  <Search className="w-4 h-4" />
                  検索
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 