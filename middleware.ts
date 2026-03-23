import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { normalizeSearchParams, toSearchQueryString } from "@/lib/search-params"

export function middleware(request: NextRequest) {
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
  matcher: ["/search"],
}
