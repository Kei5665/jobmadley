// サーバールート: 求人応募情報を外部 Webhook へ転送する
import { NextResponse } from "next/server"

const WEBHOOK_URL =
  "https://ipef3glqb1t.jp.larksuite.com/base/automation/webhook/event/ZriRalpF8w99nPhDQ1ijp8m1pRc"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // デバッグ用: 受信した応募データをサーバーログへ出力
    console.log("[submit-application] payload:", body)

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      // Webhook 側のエラーをクライアントに伝える
      const text = await res.text()
      return NextResponse.json({ success: false, message: text }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook Forward Error", error)
    return NextResponse.json({ success: false, message: "internal error" }, { status: 500 })
  }
} 