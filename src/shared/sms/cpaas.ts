// CPaaS NOW（ネクスウェイ）SMS 送信の共通トランスポート（ゼロ依存）。
// POST /api/v1/short_messages に1通送信し、結果オブジェクトで返す（失敗時も例外を投げない）。
// click_tracking=true で本文中URLは短縮配信されクリック計測される。
// 接続先・認証は smsEnv（CPAASNOW_BASE_URL / CPAASNOW_API_TOKEN）。
// トークン未設定なら送信せず skipped:true（誤送信防止）。

import { smsEnv } from "@/shared/config/env"

export interface CpaasSendResult {
  ok: boolean
  status: number
  deliveryOrderId?: number
  acceptedAt?: string
  skipped?: boolean
  message?: string
}

export const sendShortMessage = async (
  args: { to: string; text: string; userReference?: string; clickTracking?: boolean },
  context: string,
): Promise<CpaasSendResult> => {
  const token = smsEnv.cpaasToken()
  if (!token) {
    console.log(`[sms:${context}] CPaaS token not configured, skipping send`)
    return { ok: false, status: 0, skipped: true, message: "not_configured" }
  }

  const base = smsEnv.cpaasBaseUrl().replace(/\/+$/, "")
  const payload: Record<string, unknown> = {
    to: args.to,
    text: args.text,
    click_tracking: args.clickTracking ?? true,
  }
  if (args.userReference) payload.user_reference = args.userReference

  try {
    const res = await fetch(`${base}/api/v1/short_messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    })
    const text = await res.text()
    let body: { delivery_order_id?: number; accepted_at?: string } | null = null
    try {
      body = JSON.parse(text) as { delivery_order_id?: number; accepted_at?: string }
    } catch {
      // JSON でない（エラーHTML等）→ 失敗扱い
    }

    if (res.status !== 202 || !body?.delivery_order_id) {
      console.error(`[sms:${context}] cpaas send failed`, { status: res.status, body: text.slice(0, 300) })
      return { ok: false, status: res.status, message: text.slice(0, 300) }
    }
    return { ok: true, status: res.status, deliveryOrderId: body.delivery_order_id, acceptedAt: body.accepted_at }
  } catch (error) {
    console.error(`[sms:${context}] cpaas send exception`, error)
    return { ok: false, status: 0, message: error instanceof Error ? error.message : String(error) }
  }
}
