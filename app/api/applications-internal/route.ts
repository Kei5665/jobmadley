import { NextResponse } from "next/server"
import { z } from "zod"

// 内部フォーム（components/application-form-page.tsx）から送られてくる項目に対応
const InternalApplicationSchema = z.object({
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  lastNameKana: z.string().min(1),
  firstNameKana: z.string().min(1),
  birthDate: z.string().min(1), // YYYY-MM-DD
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  companyName: z.string().optional(),
  jobName: z.string().optional(),
  jobUrl: z.string().url().optional(),
  jobId: z.string().optional(),
  message: z.string().optional(),
})

function buildInternalLarkCard(input: z.infer<typeof InternalApplicationSchema>) {
  const appliedAt = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const jobLines: string[] = []
  if (input.companyName || input.jobName || input.jobUrl || input.jobId) {
    jobLines.push(
      `会社名: ${input.companyName ?? '—'}`,
      `求人名: ${input.jobName ?? '—'}`,
      `求人URL: ${input.jobUrl ?? '—'}`,
      `求人ID: ${input.jobId ?? '—'}`
    )
  }

  const details = [
    `1. 氏名: ${input.lastName} ${input.firstName}`,
    `2. ふりがな: ${input.lastNameKana} ${input.firstNameKana}`,
    `3. 生年月日: ${input.birthDate}`,
    `4. 電話番号: ${input.phone}`,
    `5. メールアドレス: ${input.email}`,
    `6. 住所: ${input.address}`,
  ].join('\n')

  return {
    msg_type: "interactive",
    card: {
      elements: [
        {
          tag: "div",
          text: { tag: "lark_md", content: `**🟦 内部フォーム応募通知**\n応募日時: ${appliedAt}` }
        },
        { tag: "hr" },
        {
          tag: "div",
          text: { tag: "lark_md", content: `**📋 応募内容**\n${details}` }
        },
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
    const json = await request.json()
    const parsed = InternalApplicationSchema.parse(json)

    const webhookUrl = process.env.LARK_WEBHOOK_INTERNAL ?? process.env.LARK_WEBHOOK
    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, message: "Webhook not configured" },
        { status: 500 }
      )
    }

    const card = buildInternalLarkCard(parsed)
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    })

    const responseText = await response.text()
    let ok = response.ok
    try {
      const j = JSON.parse(responseText)
      if (typeof j?.code === 'number') ok = ok && j.code === 0
      if (typeof j?.StatusCode === 'number') ok = ok && j.StatusCode === 0
    } catch (_) {
      // 本文がJSONでない場合はHTTPステータスのみを見る
    }

    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Failed to send to Lark" },
        { status: response.ok ? 502 : response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid request'
    // バリデーションエラーは400で返す
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    )
  }
}


