import { NextResponse } from "next/server"

function buildInternalLarkCard(input: any) {
  const appliedAt = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const details = [
    `1. 氏名: ${input.lastName ?? ''} ${input.firstName ?? ''}`,
    `2. ふりがな: ${input.lastNameKana ?? ''} ${input.firstNameKana ?? ''}`,
    `3. 生年月日: ${input.birthDate ?? ''}`,
    `4. 電話番号: ${input.phone ?? ''}`,
    `5. メールアドレス: ${input.email ?? ''}`,
    `6. 住所: ${input.address ?? ''}`,
  ].join('\n')

  const jobLines: string[] = []
  if (input.companyName || input.jobName || input.jobUrl || input.jobId) {
    jobLines.push(
      `会社名: ${input.companyName ?? '—'}`,
      `求人名: ${input.jobName ?? '—'}`,
      `求人URL: ${input.jobUrl ?? '—'}`,
      `求人ID: ${input.jobId ?? '—'}`,
    )
  }

  return {
    msg_type: "interactive",
    card: {
      elements: [
        { tag: "div", text: { tag: "lark_md", content: `**🟦 内部フォーム応募通知**\n応募日時: ${appliedAt}` } },
        { tag: "hr" },
        { tag: "div", text: { tag: "lark_md", content: `**📋 応募内容**\n${details}` } },
        ...(jobLines.length > 0 ? [
          { tag: "hr" },
          { tag: "div", text: { tag: "lark_md", content: `**💼 求人情報**\n${jobLines.join('\n')}` } },
        ] : []),
      ]
    }
  }
}

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

    const webhookUrl = process.env.LARK_WEBHOOK_INTERNAL ?? process.env.LARK_WEBHOOK
    if (!webhookUrl) {
      console.error("[ERROR] Lark webhook is not configured")
      return NextResponse.json({ success: false, message: "Webhook not configured" }, { status: 500 })
    }

    const card = buildInternalLarkCard(incoming)
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    })

    const responseText = await response.text()
    let ok = response.ok
    try {
      const parsed = JSON.parse(responseText)
      if (typeof parsed?.code === 'number') ok = ok && parsed.code === 0
      if (typeof parsed?.StatusCode === 'number') ok = ok && parsed.StatusCode === 0
    } catch (_) {
      // 非JSONレスポンスはHTTPステータスのみで判定
    }

    if (!ok) {
      console.error("[ERROR] Failed to send to Lark:", { status: response.status, body: responseText })
      return NextResponse.json(
        { success: false, message: "Failed to send to Lark" },
        { status: response.ok ? 502 : response.status }
      )
    }

    console.log("[SUCCESS] Sent internal application to Lark")
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