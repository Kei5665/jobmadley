"use client"

import { useEffect } from "react"

/**
 * 応募ページ初回表示時に URL の `stb_uid` / `source` を localStorage に取り込む。
 * 以降の応募送信で参照される。`source=unknown` は明示的に消す。
 */
export function useApplySourceCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const stbUid = searchParams.get("stb_uid")
      if (stbUid) {
        window.localStorage.setItem("stb_uid", stbUid)
      }
      const rawSource = searchParams.get("source")
      const normalizedSource = rawSource?.trim().toLowerCase()
      if (normalizedSource && normalizedSource !== "unknown") {
        window.localStorage.setItem("application_source", normalizedSource)
      } else if (normalizedSource === "unknown") {
        window.localStorage.removeItem("application_source")
      }
    } catch (_) {
      // Ignore storage or URL parsing errors.
    }
  }, [])
}
