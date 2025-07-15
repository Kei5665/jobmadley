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
import { useEffect, useState } from "react"
import type { Municipality } from "@/lib/types"

interface MunicipalityDialogProps {
  prefectureId: string
  prefectureName: string
  keyword?: string
}

export default function MunicipalityDialog({ prefectureId, prefectureName, keyword }: MunicipalityDialogProps) {
  const [open, setOpen] = useState(false)
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || municipalities.length > 0) return

    const fetchMunicipalities = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/municipalities?prefecture=${prefectureId}`)
        if (!res.ok) throw new Error("failed")
        const data: Municipality[] = await res.json()
        setMunicipalities(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchMunicipalities()
  }, [open, municipalities.length, prefectureId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          {loading ? (
            <p className="text-center text-sm text-gray-500 py-4">読み込み中...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x">
              {municipalities.map((m) => {
                const params = new URLSearchParams()
                if (keyword) params.set("q", keyword)
                params.set("prefecture", prefectureId)
                params.set("municipality", m.id)
                const href = `/search?${params.toString()}`
                
                return (
                  <DialogClose asChild key={m.id}>
                    <Link
                      href={href}
                      className="flex items-center justify-between p-3 text-sm text-teal-600 hover:bg-teal-50 border-b"
                    >
                      <span className="text-gray-800">{m.name}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </DialogClose>
                )
              })}
              {municipalities.length === 0 && !loading && (
                <p className="col-span-full text-sm text-gray-500 text-center py-4">
                  市区町村データがありません
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 