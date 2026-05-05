"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { buildSearchQuery } from "@/lib/utils"

interface KeywordInputProps {
  keyword?: string
  prefectureId?: string
  municipalityId?: string
  tagIds?: string[]
  jobCategoryId?: string
  sort?: string
}

export default function KeywordInput({
  keyword,
  prefectureId,
  municipalityId,
  tagIds,
  jobCategoryId,
  sort,
}: KeywordInputProps) {
  const [inputValue, setInputValue] = useState(keyword || "")
  const router = useRouter()

  const handleSearch = () => {
    const query = buildSearchQuery({
      keyword: inputValue.trim() || undefined,
      prefectureId,
      municipalityId,
      tagIds,
      jobCategoryId,
      sort,
    })
    router.push(`/search?${query}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        フリーワード
      </label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="キーワードを入力"
          className="flex-1"
        />
        <Button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="icon"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
