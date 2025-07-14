import Link from "next/link"
import type { PrefectureGroup } from "@/lib/types"

interface RegionSearchSectionProps {
  prefectures: PrefectureGroup
  countMap: Record<string, number>
}

export default function RegionSearchSection({ prefectures, countMap }: RegionSearchSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 pt-24">
      {/* セクションタイトル */}
      <h2 className="text-xl md:text-3xl font-bold mb-6 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3 rounded" />
        勤務先から探す
      </h2>

      {/* 地方ごとの都道府県リンク */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8">
        {Object.entries(prefectures).map(([area, prefs]) => (
          <div key={area} className="space-y-3">
            <h3 className="font-semibold text-gray-800 text-xl">{area}</h3>
            <div className="flex flex-wrap gap-4">
              {prefs.map((pref) => (
                <Link
                  key={pref.id}
                  href={`/search?prefecture=${encodeURIComponent(pref.id)}`}
                  className="text-blue-700 hover:underline"
                >
                  {pref.region}
                  {countMap[pref.id] ? ` (${countMap[pref.id]})` : ""}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 