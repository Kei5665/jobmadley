import { NextResponse } from "next/server"
import { larkEnv } from "@/lib/config/env"
import { sendToLark } from "@/lib/lark/client"

interface ContactInput {
  company?: string
  contactName?: string
  email?: string
  phone?: string
  topic?: string
  detail?: string
  [key: string]: unknown
}

const TOPIC_LABELS: Record<string, string> = {
  consult: "採用について相談したい",
  service: "サービス内容を知りたい",
  other: "その他",
}

const buildLarkCard = (input: ContactInput) => {
  const receivedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
  const topicLabel = (typeof input.topic === "string" && TOPIC_LABELS[input.topic]) || input.topic || ""
  const details = [
    `1. 会社名: ${input.company ?? ""}`,
    `2. ご担当者名: ${input.contactName ?? ""}`,
    `3. 会社メール: ${input.email ?? ""}`,
    `4. 電話番号: ${input.phone ?? ""}`,
    `5. お問い合わせ内容: ${topicLabel}`,
    `6. お問い合わせ詳細: ${input.detail ? String(input.detail).slice(0, 2000) : "(未記入)"}`,
  ].join("\n")

  return {
    msg_type: "interactive",
    card: {
      elements: [
        { tag: "div", text: { tag: "lark_md", content: `**🟦 お問い合わせ通知**\n受信時刻: ${receivedAt}` } },
        { tag: "hr" },
        { tag: "div", text: { tag: "lark_md", content: `**📩 内容**\n${details}` } },
      ],
    },
  }
}

const parseRequestBody = async (request: Request): Promise<ContactInput> => {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await request.json()) as ContactInput
  }
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData()
    return Object.fromEntries(form.entries()) as ContactInput
  }
  try {
    return (await request.json()) as ContactInput
  } catch {
    return {}
  }
}

export async function POST(request: Request) {
  try {
    const payload = await parseRequestBody(request)

    let webhookUrl: string
    try {
      webhookUrl = larkEnv.contact()
    } catch {
      return NextResponse.json({ success: false, message: "Webhook not configured" }, { status: 500 })
    }

    const result = await sendToLark(webhookUrl, buildLarkCard(payload), "contact")
    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to send to Lark", body: result.body },
        { status: result.status || 502 },
      )
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: "internal error" }, { status: 500 })
  }
}
