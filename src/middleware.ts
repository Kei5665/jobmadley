import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { normalizeSearchParams, toSearchQueryString } from "@/shared/lib/search-params"

// 正規ドメイン。非正規ドメイン（jobmadley.vercel.app 等の直 Vercel アクセス）への本番
// アクセスをここへ 308 で集約し、計測汚染とインデックス重複を防ぐ。
const CANONICAL_ORIGIN = "https://ridejob.jp"

// 本番環境で、非正規ドメイン（*.vercel.app への直アクセス）だけを正規ドメインへ 308 集約する。
//
// 重要（過去にここで本番障害を出した）: 正規ドメイン ridejob.jp は Cloudflare → Vercel の
// プロキシ構成で、Vercel オリジンが受け取る Host は .vercel.app に書き換えられる。そのため
// host だけで判定すると ridejob.jp のアクセスにも一致して自己ループ（site down）になる。
// Cloudflare 経由のリクエストには cf-connecting-ip / cf-ray が必ず付くので、これを使って
// 「CF 経由（= 正規ドメイン ridejob.jp）」を確実に除外する。直 Vercel の vercel.app には
// これらのヘッダは付かない。
function canonicalHostRedirect(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") return null

  // Cloudflare 経由（= ridejob.jp 正規トラフィック）は対象外。
  if (request.headers.has("cf-connecting-ip") || request.headers.has("cf-ray")) {
    return null
  }

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
