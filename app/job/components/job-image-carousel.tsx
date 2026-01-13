"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getJobImageUrl } from "@/lib/utils"
import type { JobImage } from "@/lib/types"

interface JobImageCarouselProps {
  images?: JobImage[]
  imageUrl?: string
  altText?: string
}

export default function JobImageCarousel({ 
  images, 
  imageUrl, 
  altText = "求人画像" 
}: JobImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const imageUrls = images && images.length > 0
    ? images.map(img => img.url)
    : [getJobImageUrl(images, imageUrl)]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
  }

  return (
    <div className="relative mb-8">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <Image
          src={imageUrls[currentImageIndex]}
          alt={altText}
          fill
          className="object-cover"
        />
        
        {imageUrls.length > 1 && (
          <>
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}
      </div>
    </div>
  )
} 
