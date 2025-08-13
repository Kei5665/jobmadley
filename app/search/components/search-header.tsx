import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import type { Municipality } from "@/lib/types"

interface SearchHeaderProps {
  jobCategoryName: string
  prefectureName: string
  selectedMunicipality: Municipality | null
  heroImageSrc: string
  totalCount: number
}

export default function SearchHeader({
  jobCategoryName,
  prefectureName,
  selectedMunicipality,
  heroImageSrc,
  totalCount,
}: SearchHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Home className="w-4 h-4 mr-1" />
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/" className="hover:text-blue-600">
            {jobCategoryName}の求人
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>
            {selectedMunicipality ? `${selectedMunicipality.name}（${prefectureName}）` : prefectureName}
            の{jobCategoryName}求人
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src={heroImageSrc}
            alt="hero-image"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {selectedMunicipality
            ? `${selectedMunicipality.name}（${prefectureName}）`
            : prefectureName}
          の{jobCategoryName}の求人情報
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg text-gray-600">
            該当件数 <span className="font-bold text-red-500">{totalCount}件</span>
          </span>
          <Link href="#" className="text-sm text-blue-600 hover:underline">
            登録情報を変更する
          </Link>
        </div>
      </div>
    </>
  )
} 