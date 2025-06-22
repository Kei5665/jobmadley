"use client"

import Link from "next/link"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ChevronRight } from "lucide-react"
import type { Municipality } from "@/lib/getMunicipalities"

interface MunicipalityDialogProps {
  municipalities: Municipality[]
  prefectureId: string
  prefectureName: string
}

export default function MunicipalityDialog({
  municipalities,
  prefectureId,
  prefectureName,
}: MunicipalityDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <span className="text-gray-800 font-medium">市区町村から選択</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="text-lg font-semibold mb-4">
          {prefectureName}の市区町村から選択
        </DialogTitle>

        {/* 市区町村リスト */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x">
            {municipalities.map((m, idx) => (
              <Link
                key={m.id}
                href={`/search?prefecture=${prefectureId}&municipality=${m.id}`}
                className="flex items-center justify-between p-3 text-sm text-teal-600 hover:bg-teal-50 border-b"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800">{m.name}</span>
                </div>
                <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
            {municipalities.length === 0 && (
              <p className="col-span-full text-sm text-gray-500 text-center py-4">
                市区町村データがありません
              </p>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <span className="text-sm text-gray-600">該当件数 {municipalities.length}件</span>
          <DialogClose asChild>
            <Link
              href={`/search?prefecture=${prefectureId}`}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
            >
              検索する
            </Link>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
} 