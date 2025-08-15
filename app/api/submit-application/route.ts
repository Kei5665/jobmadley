import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // 詳細なリクエスト情報をログ出力
    const timestamp = new Date().toISOString()
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const contentLength = request.headers.get('content-length') || 'unknown'
    const xForwardedFor = request.headers.get('x-forwarded-for') || 'unknown'
    const referer = request.headers.get('referer') || 'unknown'

    console.log("=".repeat(80))
    console.log(`[INFO] ${timestamp} - submit-application POST Request Received`)
    console.log("=".repeat(80))
    console.log(`[INFO] Environment: ${process.env.NODE_ENV}`)
    console.log(`[INFO] Vercel URL: ${process.env.VERCEL_URL || 'not set'}`)
    console.log(`[INFO] Request Headers:`)
    console.log(`  - User-Agent: ${userAgent}`)
    console.log(`  - Content-Length: ${contentLength}`)
    console.log(`  - X-Forwarded-For: ${xForwardedFor}`)
    console.log(`  - Referer: ${referer}`)
    console.log("=".repeat(80))

    const incoming: any = await request.json()

    console.log("[INFO] Raw Request Data (Pretty Formatted):")
    console.log(JSON.stringify(incoming, null, 2))

    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://ridejob.jp'

    // 内部フォーム専用エンドポイントへそのまま転送
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    if (bypassToken) {
      headers["x-vercel-protection-bypass"] = bypassToken
    }

    const res = await fetch(`${baseUrl}/api/applications-internal`, {
      method: "POST",
      headers,
      body: JSON.stringify(incoming),
    })

    const text = await res.text()
    if (!res.ok) {
      console.error("=".repeat(80))
      console.error(`[ERROR] ${new Date().toISOString()} - Applications Internal API Error`)
      console.error(`[ERROR] Status: ${res.status}`)
      console.error(`[ERROR] Response: ${text}`)
      console.error("=".repeat(80))
      return NextResponse.json({ success: false, message: text }, { status: res.status })
    }

    console.log("=".repeat(80))
    console.log(`[SUCCESS] ${new Date().toISOString()} - Successfully sent to applications-internal API`)
    console.log("=".repeat(80))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("=".repeat(80))
    console.error(`[ERROR] ${new Date().toISOString()} - Unexpected Error in submit-application`)
    console.error(`[ERROR] Error Message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    console.error(`[ERROR] Error Stack: ${error instanceof Error ? error.stack : 'No stack trace'}`)
    console.error(`[ERROR] Error Type: ${typeof error}`)
    console.error(`[ERROR] Full Error Object:`, error)
    console.error("=".repeat(80))
    return NextResponse.json({ success: false, message: "internal error" }, { status: 500 })
  }
}