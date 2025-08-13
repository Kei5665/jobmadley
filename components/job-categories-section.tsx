import Link from "next/link"
import type { JobCategory } from "@/lib/types"

interface JobCategoriesSectionProps {
  categories: JobCategory[]
}

export default function JobCategoriesSection({ categories }: JobCategoriesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <h2 className="text-xl md:text-3xl font-bold mb-6 flex items-center">
        <span className="inline-block w-1.5 h-6 bg-blue-600 mr-3 rounded" />
        職種から探す
      </h2>

      <div className="flex flex-wrap gap-3 pt-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/search?jobCategory=${encodeURIComponent(c.id)}`}
            className="px-4 py-2 text-sm md:text-base rounded-md border border-blue-600 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  )
}


