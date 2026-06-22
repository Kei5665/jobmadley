import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { normalizeSearchParams, toSearchQueryString } from "@/shared/lib/search-params"

// 正規ドメイン。非正規ドメイン（*.vercel.app の素/エイリアス）への本番アクセスを
// ここへ 308 で集約し、計測汚染とインデックス重複を防ぐ。
const CANONICAL_ORIGIN = "https://ridejob.jp"

// 本番環境かつホストが *.vercel.app の場合のみ正規ドメインへ 308 リダイレクトする。
// - 独自ドメイン（ridejob.jp）は host が .vercel.app で終わらないため対象外。
// - プレビューデプロイは VERCEL_ENV !== "production" のため対象外（QA用に温存）。
function canonicalHostRedirect(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") return null

  const host = request.headers.get("host") ?? ""
  if (!host.endsWith(".vercel.app")) return null

  const target = new URL(
    request.nextUrl.pathname + request.nextUrl.search,
    CANONICAL_ORIGIN,
  )
  return NextResponse.redirect(target, 308)
}

export function middleware(request: NextRequest) {
  const hostRedirect = canonicalHostRedirect(request)
  if (hostRedirect) {
    return hostRedirect
  }

  if (request.nextUrl.pathname !== "/search") {
    return NextResponse.next()
  }

  const raw: Record<string, string> = {}
  request.nextUrl.searchParams.forEach((value, key) => {
    if (!(key in raw)) {
      raw[key] = value
    }
  })

  const { normalized, requiresRedirect } = normalizeSearchParams(raw)
  if (!requiresRedirect) {
    return NextResponse.next()
  }

  const normalizedQuery = toSearchQueryString(normalized)
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.search = normalizedQuery ? `?${normalizedQuery}` : ""

  return NextResponse.redirect(redirectUrl, 308)
}

export const config = {
  // ホスト正規化を全ページに効かせるため対象を拡大（静的アセット類は除外）。
  // 既存の /search 正規化も引き続きこの matcher に含まれる。
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}
