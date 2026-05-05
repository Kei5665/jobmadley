import type { ImageProps } from 'next/image'

// =====================
// 画像最適化関連
// =====================

/**
 * 画像のサイズ設定
 */
export const imageSizes = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 300, height: 200 },
  hero: { width: 1200, height: 600 },
  detail: { width: 800, height: 600 },
} as const

/**
 * レスポンシブ画像のサイズ設定
 */
export const responsiveImageSizes = {
  mobile: "100vw",
  tablet: "50vw",
  desktop: "33vw",
} as const

/**
 * 画像の優先度を決定
 */
export const getImagePriority = (position: 'hero' | 'above-fold' | 'below-fold'): boolean => {
  return position === 'hero' || position === 'above-fold'
}

/**
 * 画像のsizesプロパティを生成
 */
export const generateImageSizes = (
  type: 'responsive' | 'fixed' | 'card' | 'thumbnail' | 'detail'
): string => {
  switch (type) {
    case 'responsive':
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    case 'card':
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
    case 'thumbnail':
      return "150px"
    case 'detail':
      return "800px"
    case 'fixed':
      return "100vw"
    default:
      return "100vw"
  }
}

/**
 * 画像URLの最適化
 */
export const optimizeImageUrl = (url: string, width?: number, height?: number): string => {
  // microCMSの画像の場合、クエリパラメータで最適化
  if (url.includes('microcms-assets.io')) {
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('fit', 'crop')
    params.set('q', '80') // 品質設定
    return `${url}?${params.toString()}`
  }

  return url
}

/**
 * プレースホルダー画像の生成
 */
export const generatePlaceholderImage = (width: number, height: number): string => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
        画像を読み込み中...
      </text>
    </svg>`
  ).toString('base64')}`
}

/**
 * 最適化されたImagePropsを生成
 */
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  type: 'hero' | 'card' | 'thumbnail' | 'detail',
  priority?: boolean
): Partial<ImageProps> => {
  const sizeConfig = imageSizes[type]
  
  return {
    src: optimizeImageUrl(src, sizeConfig.width, sizeConfig.height),
    alt,
    width: sizeConfig.width,
    height: sizeConfig.height,
    sizes: generateImageSizes(type === 'hero' ? 'responsive' : type),
    priority: priority ?? getImagePriority(type === 'hero' ? 'hero' : 'below-fold'),
    placeholder: 'blur',
    blurDataURL: generatePlaceholderImage(sizeConfig.width, sizeConfig.height),
    quality: 80,
    style: {
      objectFit: 'cover',
    },
  }
}

/**
 * 画像の遅延読み込み設定
 */
export const getLazyLoadingConfig = (isAboveFold: boolean) => ({
  loading: isAboveFold ? 'eager' as const : 'lazy' as const,
  priority: isAboveFold,
})

/**
 * 画像のアスペクト比を計算
 */
export const calculateAspectRatio = (width: number, height: number): string => {
  const ratio = width / height
  return `${ratio.toFixed(2)} / 1`
} 