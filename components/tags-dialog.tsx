"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Star } from "lucide-react"
import type { Tag } from "@/lib/types"

interface TagDialogProps {
  tags: Tag[]
  selectedTagIds: string[]
  prefectureId?: string
  municipalityId?: string
}

export default function TagDialog({ tags, selectedTagIds, prefectureId, municipalityId }: TagDialogProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(selectedTagIds)

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const apply = () => {
    const params = new URLSearchParams()
    if (prefectureId) params.set("prefecture", prefectureId)
    if (municipalityId) params.set("municipality", municipalityId)
    if (selected.length) params.set("tags", selected.join(","))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-teal-600 mr-3" />
              <span className="text-gray-800">特徴から選択</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="text-lg font-semibold mb-4">特徴（タグ）を選択</DialogTitle>

        {/* タグリスト */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {tags.map((tag) => {
              const checked = selected.includes(tag.id)
              return (
                <label
                  key={tag.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer text-sm"
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggle(tag.id)} />
                  <span className="text-gray-800">{tag.name}</span>
                </label>
              )
            })}
            {tags.length === 0 && (
              <p className="col-span-full text-sm text-gray-500 text-center py-4">タグデータがありません</p>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-end pt-4 border-t mt-4 space-x-2">
          <DialogClose asChild>
            <button className="px-4 py-2 text-sm text-gray-600 rounded hover:bg-gray-100">キャンセル</button>
          </DialogClose>
          <DialogClose asChild>
            <button onClick={apply} className="px-4 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700">
              適用
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
} 