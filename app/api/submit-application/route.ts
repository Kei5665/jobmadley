import { NextResponse } from "next/server"

interface ApplicationPayload {
  lastName?: string
  firstName?: string
  lastNameKana?: string
  firstNameKana?: string
  birthDate?: string
  phone?: string
  email?: string
  applicationSource?: string
  companyName?: string
  jobName?: string
  jobUrl?: string
  jobId?: string
  utmSource?: string
  utmMedium?: string
  [key: string]: unknown
}

function buildInternalLarkCard(input: ApplicationPayload, isMechanic: boolean = false) {
  const appliedAt = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const normalizedSource = (input.applicationSource ?? (typeof input.jobUrl === 'string' && input.jobUrl.includes('source=standby') ? 'standby' : undefined))?.trim().toLowerCase()
  const isStandby = normalizedSource === 'standby'
  const details = [
    `1. 氏名: ${input.lastName ?? ''} ${input.firstName ?? ''}`,
    `2. ふりがな: ${input.lastNameKana ?? ''} ${input.firstNameKana ?? ''}`,
    `3. 生年月日: ${input.birthDate ?? ''}`,
    `4. 電話番号: ${input.phone ?? ''}`,
    `5. メールアドレス: ${input.email ?? ''}`,
  ].join('\n')

  const jobLines: string[] = []
  if (input.companyName || input.jobName || input.jobUrl || input.jobId) {
    jobLines.push(
      `会社名: ${input.companyName ?? '—'}`,
      `求人名: ${input.jobName ?? '—'}`,
      `求人URL: ${input.jobUrl ?? `https://ridejob.jp/job/${input.jobId ?? '—'}`}`,
    )
  }

  // UTM情報の追加
  const utmLines: string[] = []
  if (input.utmSource || input.utmMedium) {
    if (input.utmSource) utmLines.push(`流入元: ${input.utmSource}`)
    if (input.utmMedium) utmLines.push(`メディア: ${input.utmMedium}`)
  }

  let titleEmoji = '🟦'
  let titleText = 'ライドジョブ求人サイトから応募がありました！'

  if (isMechanic && isStandby) {
    titleEmoji = '🔧'
    titleText = 'スタンバイから整備士の応募がありました！'
  } else if (isMechanic) {
    titleEmoji = '🔧'
    titleText = 'ライドジョブ求人サイトから整備士の応募がありました！'
  } else if (isStandby) {
    titleEmoji = '🟦'
    titleText = 'スタンバイからの応募がありました！'
  }

  return {
    msg_type: "interactive",
    card: {
      elements: [
        { tag: "div", text: { tag: "lark_md", content: `**${titleEmoji} ${titleText}**\n応募日時: ${appliedAt}` } },
        { tag: "hr" },
        { tag: "div", text: { tag: "lark_md", content: `**📋 応募内容**\n${details}` } },
        ...(jobLines.length > 0 ? [
          { tag: "hr" },
          { tag: "div", text: { tag: "lark_md", content: `**💼 求人情報**\n${jobLines.join('\n')}` } },
        ] : []),
        ...(utmLines.length > 0 ? [
          { tag: "hr" },
          { tag: "div", text: { tag: "lark_md", content: `**📊 流入経路**\n${utmLines.join('\n')}` } },
        ] : []),
      ]
    }
  }
}

function buildBaseRegistrationPayload(input: ApplicationPayload) {
  const appliedAt = new Date().toISOString()

  return {
    lastName: input.lastName ?? '',
    firstName: input.firstName ?? '',
    lastNameKana: input.lastNameKana ?? '',
    firstNameKana: input.firstNameKana ?? '',
    birthDate: input.birthDate ?? '',
    phone: input.phone ?? '',
    email: input.email ?? '',
    companyName: input.companyName ?? '',
    jobName: input.jobName ?? '',
    jobUrl: input.jobUrl ?? (input.jobId ? `https://ridejob.jp/job/${input.jobId}` : ''),
    jobId: input.jobId ?? '',
    applicationSource: input.applicationSource ?? '',
    utmSource: input.utmSource ?? '',
    utmMedium: input.utmMedium ?? '',
    appliedAt,
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

    const incoming = await request.json() as ApplicationPayload

    console.log("[INFO] Raw Request Data (Pretty Formatted):")
    console.log(JSON.stringify(incoming, null, 2))

    // 求人名に「整備士」が含まれているかチェック
    const jobName = incoming.jobName ?? ''
    const isMechanic = jobName.includes('整備士')

    // 会社名に「CP One Japan」が含まれているかチェック
    const companyName = incoming.companyName ?? ''
    const isCpOne = companyName.includes('CP One Japan')

    // 会社名・求人名に応じてwebhookを振り分け
    let webhookUrl: string | undefined
    if (isCpOne) {
      webhookUrl = process.env.LARK_WEBHOOK_CPONE
      console.log("[INFO] Detected CP One Japan company, using LARK_WEBHOOK_CPONE")
    } else if (isMechanic) {
      webhookUrl = process.env.LARK_WEBHOOK_MECHANIC
      console.log("[INFO] Detected mechanic job, using LARK_WEBHOOK_MECHANIC")
    } else {
      webhookUrl = process.env.LARK_WEBHOOK
    }

    if (!webhookUrl) {
      const webhookType = isCpOne ? 'LARK_WEBHOOK_CPONE' : isMechanic ? 'LARK_WEBHOOK_MECHANIC' : 'LARK_WEBHOOK'
      console.error(`[ERROR] Lark webhook is not configured (${webhookType})`)
      return NextResponse.json({ success: false, message: "Webhook not configured" }, { status: 500 })
    }

    // Base登録用のWebhook URL（会社名・求人名に応じて分岐）
    let baseWebhookUrl: string | undefined
    if (isCpOne) {
      baseWebhookUrl = process.env.LARK_WEBHOOK_BASE_CPONE
      console.log("[INFO] Using LARK_WEBHOOK_BASE_CPONE for base registration")
    } else if (isMechanic) {
      baseWebhookUrl = process.env.LARK_WEBHOOK_BASE_MECHANIC
      console.log("[INFO] Using LARK_WEBHOOK_BASE_MECHANIC for base registration")
    } else {
      baseWebhookUrl = process.env.LARK_WEBHOOK_BASE
    }

    // Webhook送信を並列実行
    const webhookPromises: Promise<{ name: string; success: boolean; error?: string }>[] = []

    // 1. カード形式の通知をLarkに送信
    const card = buildInternalLarkCard(incoming, isMechanic)
    webhookPromises.push(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      })
        .then(async (response) => {
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
            console.error("[ERROR] Failed to send card to Lark:", { status: response.status, body: responseText })
            return { name: 'notification', success: false, error: responseText }
          }

          console.log("[SUCCESS] Sent notification card to Lark")
          return { name: 'notification', success: true }
        })
        .catch((error) => {
          console.error("[ERROR] Exception sending card to Lark:", error)
          return { name: 'notification', success: false, error: String(error) }
        })
    )

    // 2. Base登録用のJSON形式データを送信（環境変数が設定されている場合のみ）
    if (baseWebhookUrl) {
      const basePayload = buildBaseRegistrationPayload(incoming)
      webhookPromises.push(
        fetch(baseWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(basePayload),
        })
          .then(async (response) => {
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
              console.error("[ERROR] Failed to send to Base webhook:", { status: response.status, body: responseText })
              return { name: 'base_registration', success: false, error: responseText }
            }

            const webhookType = isCpOne ? 'LARK_WEBHOOK_BASE_CPONE' : isMechanic ? 'LARK_WEBHOOK_BASE_MECHANIC' : 'LARK_WEBHOOK_BASE'
            console.log(`[SUCCESS] Sent application data to Base webhook (${webhookType})`)
            return { name: 'base_registration', success: true }
          })
          .catch((error) => {
            const webhookType = isCpOne ? 'LARK_WEBHOOK_BASE_CPONE' : isMechanic ? 'LARK_WEBHOOK_BASE_MECHANIC' : 'LARK_WEBHOOK_BASE'
            console.error(`[ERROR] Exception sending to Base webhook (${webhookType}):`, error)
            return { name: 'base_registration', success: false, error: String(error) }
          })
      )
    } else {
      const webhookType = isCpOne ? 'LARK_WEBHOOK_BASE_CPONE' : isMechanic ? 'LARK_WEBHOOK_BASE_MECHANIC' : 'LARK_WEBHOOK_BASE'
      console.log(`[INFO] ${webhookType} is not configured, skipping base registration`)
    }

    // すべてのWebhook送信を待機
    const results = await Promise.all(webhookPromises)

    // 通知Webhookの失敗は致命的エラーとして扱う
    const notificationResult = results.find(r => r.name === 'notification')
    if (notificationResult && !notificationResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send notification to Lark" },
        { status: 502 }
      )
    }

    // Base登録の失敗はログに記録するが、リクエストは成功として扱う
    const baseResult = results.find(r => r.name === 'base_registration')
    if (baseResult && !baseResult.success) {
      console.warn("[WARNING] Base registration failed, but proceeding with success response")
    }

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