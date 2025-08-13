import Link from "next/link"
import type { Tag } from "@/lib/types"

interface PopularTagsSectionProps {
  tags: Tag[]
}

export default function PopularTagsSection({ tags }: PopularTagsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      {/* セクションタイトル */}
      <h2 className="text-xl md:text-3xl font-bold mb-6 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3 rounded" />
        人気のキーワードから探す
      </h2>

      {/* タグ一覧 */}
      <div className="flex flex-wrap gap-3 pt-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/search?tags=${encodeURIComponent(tag.id)}`}
            className="px-4 py-2 text-sm md:text-base rounded-md border border-blue-600 text-blue-700 font-bold hover:bg-blue-50 transition-colors"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </section>
  )
}


