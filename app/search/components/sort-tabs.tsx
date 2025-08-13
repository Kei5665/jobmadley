"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function SortTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get("sort") ?? "recommended"

  const setSort = (value: "recommended" | "new") => {
    const p = new URLSearchParams(searchParams)
    p.set("sort", value)
    // ページングはリセット
    p.delete("page")
    router.push(`/search?${p.toString()}`)
  }

  const baseClass =
    "px-4 py-2 text-sm rounded-md border transition-colors"
  const activeClass = "bg-blue-600 text-white border-blue-600"
  const inactiveClass = "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setSort("recommended")}
        className={`${baseClass} ${current === "recommended" ? activeClass : inactiveClass}`}
      >
        おすすめ順
      </button>
      <button
        onClick={() => setSort("new")}
        className={`${baseClass} ${current === "new" ? activeClass : inactiveClass}`}
      >
        新着順
      </button>
    </div>
  )
}


