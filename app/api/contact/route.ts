import { NextResponse } from "next/server"

function buildLarkCard(input: any) {
  const receivedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })

  const topicMap: Record<string, string> = {
    consult: "採用について相談したい",
    service: "サービス内容を知りたい",
    other: "その他",
  }

  const details = [
    `1. 会社名: ${input.company ?? ""}`,
    `2. ご担当者名: ${input.contactName ?? ""}`,
    `3. 会社メール: ${input.email ?? ""}`,
    `4. 電話番号: ${input.phone ?? ""}`,
    `5. お問い合わせ内容: ${topicMap[input.topic as string] ?? input.topic ?? ""}`,
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

export async function POST(request: Request) {
  try {
    let payload: any
    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      payload = await request.json()
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await request.formData()
      payload = Object.fromEntries(form.entries())
    } else {
      // ベストエフォートでJSONとして読む
      try {
        payload = await request.json()
      } catch {
        payload = {}
      }
    }

    const webhookUrl = process.env.LARK_CONTACT_WEBHOOK ||
      "https://open.larksuite.com/open-apis/bot/v2/hook/03e9f000-d800-445b-9890-e3670d2f44c3"

    const card = buildLarkCard(payload)

    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    })

    const text = await resp.text()
    let ok = resp.ok
    try {
      const parsed = JSON.parse(text)
      if (typeof parsed?.code === "number") ok = ok && parsed.code === 0
    } catch (_) {}

    if (!ok) {
      return NextResponse.json({ success: false, message: "Failed to send to Lark", body: text }, { status: resp.status || 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, message: "internal error" }, { status: 500 })
  }
}


