"use client"

import Link from "next/link"
import { MapPin, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PrefectureGroup } from "@/lib/getPrefectures"

interface PrefectureTabsSectionProps {
  prefectures: PrefectureGroup
  countMap: Record<string, number>
}

export default function PrefectureTabsSection({ prefectures, countMap }: PrefectureTabsSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <Tabs defaultValue="prefecture" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="prefecture" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            都道府県から選択
          </TabsTrigger>
          <TabsTrigger value="employment" className="flex items-center">
            雇用形態 給与から選択
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center">
            特徴から選択
          </TabsTrigger>
        </TabsList>

        {/* 都道府県タブ */}
        <TabsContent value="prefecture">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
            {Object.entries(prefectures).map(([area, prefs]) => (
              <div key={area} className="space-y-3">
                <h3 className="font-semibold text-gray-800 text-center">{area}</h3>
                <div className="space-y-2">
                  {prefs.map((pref) => (
                    <Link
                      key={pref.id}
                      href={`/search?prefecture=${encodeURIComponent(pref.id)}`}
                      className="flex items-center justify-between p-2 text-sm text-teal-600 hover:bg-teal-50 rounded transition-colors"
                    >
                      <span>
                        {pref.name}
                        <span className="ml-1 text-xs text-gray-500">({countMap[pref.id] ?? 0})</span>
                      </span>
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 雇用形態タブ */}
        <TabsContent value="employment">
          <div className="text-center py-8 text-gray-500">雇用形態 給与の選択肢がここに表示されます</div>
        </TabsContent>

        {/* 特徴タブ */}
        <TabsContent value="features">
          <div className="text-center py-8 text-gray-500">特徴の選択肢がここに表示されます</div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 