"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function UTMCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // URLからUTMパラメーターを取得
    const utmSource = searchParams.get("utm_source")
    const utmMedium = searchParams.get("utm_medium")

    // いずれかが存在する場合、Cookieに保存
    if (utmSource || utmMedium) {
      // 既存のCookieを取得
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=")
        acc[key] = value
        return acc
      }, {} as Record<string, string>)

      // utm_sourceの保存（30日間有効）
      if (utmSource && cookies.utm_source !== utmSource) {
        document.cookie = `utm_source=${encodeURIComponent(utmSource)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
        console.log("[UTM] Saved utm_source:", utmSource)
      }

      // utm_mediumの保存（30日間有効）
      if (utmMedium && cookies.utm_medium !== utmMedium) {
        document.cookie = `utm_medium=${encodeURIComponent(utmMedium)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
        console.log("[UTM] Saved utm_medium:", utmMedium)
      }
    }
  }, [searchParams])

  return null // UIは表示しない
}

