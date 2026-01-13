"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { JobImage } from "@/lib/types"

interface JobPhotoGridProps {
  images: JobImage[]
}

function getGridLayout(imageCount: number): string {
  if (imageCount === 1) return "grid-cols-1"
  if (imageCount === 2) return "grid-cols-1 sm:grid-cols-2"
  if (imageCount === 3) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
  if (imageCount >= 4) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
}

export default function JobPhotoGrid({ images }: JobPhotoGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeImage = activeIndex != null ? images[activeIndex] : null

  useEffect(() => {
    if (activeIndex == null) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeIndex])

  return (
    <>
      <div className={`grid gap-4 ${getGridLayout(images.length)}`}>
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="block w-full text-left cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            {image.width && image.height ? (
              <Image
                src={image.url}
                alt={`職場の写真 ${index + 1}`}
                width={image.width}
                height={image.height}
                className="h-auto w-auto max-w-full rounded-lg"
              />
            ) : (
              <img
                src={image.url}
                alt={`職場の写真 ${index + 1}`}
                className="h-auto w-auto max-w-full rounded-lg"
                loading="lazy"
              />
            )}
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="閉じる"
              className="absolute -right-3 -top-3 rounded-full bg-white/90 px-3 py-1 text-sm text-gray-800 shadow hover:bg-white"
            >
              ×
            </button>
            {activeImage.width && activeImage.height ? (
              <Image
                src={activeImage.url}
                alt="拡大表示"
                width={activeImage.width}
                height={activeImage.height}
                sizes="90vw"
                className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-lg"
              />
            ) : (
              <img
                src={activeImage.url}
                alt="拡大表示"
                className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
