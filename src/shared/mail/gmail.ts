// Gmail API 送信の共通トランスポート（ゼロ依存）。
// サービスアカウント + ドメインワイド委任で、メッセージごとに指定された
// From アドレス（= impersonate 対象ユーザー）として送信する。
// Node 標準 crypto で RS256 JWT を署名 → アクセストークン交換 → users.messages.send。
// Lark 送信と同様、失敗しても例外を投げず結果オブジェクトで返す（呼び出し側で非致命扱い）。

import { createSign } from "crypto"
import { gmailEnv } from "@/shared/config/env"

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
const GMAIL_SEND_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.send"

export interface MailMessage {
  to: string
  /**
   * impersonate する実ユーザー（JWT sub）。
   * From アドレスがエイリアスの場合は、その本体ユーザーを指定する。
   */
  impersonateUser: string
  /** MIME の From ヘッダに使うアドレス（impersonateUser のエイリアスでも可） */
  fromAddress: string
  fromName: string
  replyTo: string
  subject: string
  /** プレーンテキスト本文 */
  text: string
}

export interface MailSendResult {
  ok: boolean
  status: number
  skipped?: boolean
  message?: string
}

const base64url = (input: Buffer | string): string =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

// アクセストークンは impersonate 対象（sub）ごとにキャッシュする
const tokenCache = new Map<string, { value: string; expiresAt: number }>()

const mintAccessToken = async (sub: string): Promise<string> => {
  const now = Math.floor(Date.now() / 1000)
  const cached = tokenCache.get(sub)
  if (cached && cached.expiresAt > now + 60) return cached.value

  const clientEmail = gmailEnv.clientEmail()
  const privateKey = gmailEnv.privateKey()
  if (!clientEmail || !privateKey) throw new Error("Gmail service account is not configured")

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claim = base64url(
    JSON.stringify({
      iss: clientEmail,
      sub, // impersonate するユーザー（= From アドレス）
      scope: GMAIL_SCOPE,
      aud: TOKEN_ENDPOINT,
      iat: now,
      exp: now + 3600,
    }),
  )
  const signingInput = `${header}.${claim}`
  const signature = createSign("RSA-SHA256").update(signingInput).sign(privateKey)
  const assertion = `${signingInput}.${base64url(signature)}`

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string }
  if (!res.ok || !data.access_token) {
    throw new Error(`token exchange failed: ${res.status} ${data.error_description ?? ""}`)
  }
  tokenCache.set(sub, { value: data.access_token, expiresAt: now + (data.expires_in ?? 3600) })
  return data.access_token
}

/** RFC 2822 MIME を組み立て base64url 化（件名・本文は UTF-8 を考慮） */
const buildRawMessage = (msg: MailMessage): string => {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(msg.subject).toString("base64")}?=`
  const headers = [
    `From: =?UTF-8?B?${Buffer.from(msg.fromName).toString("base64")}?= <${msg.fromAddress}>`,
    `To: ${msg.to}`,
    `Reply-To: ${msg.replyTo}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  ].join("\r\n")
  const body = Buffer.from(msg.text).toString("base64").replace(/(.{76})/g, "$1\r\n")
  return base64url(`${headers}\r\n\r\n${body}`)
}

/**
 * Gmail API でメールを送信する。
 * 未設定時は skipped:true を返し、送信失敗時も例外を投げない。
 */
export const sendMail = async (msg: MailMessage, context: string): Promise<MailSendResult> => {
  if (!gmailEnv.isConfigured()) {
    console.log(`[mail:${context}] Gmail not configured, skipping send`)
    return { ok: false, status: 0, skipped: true, message: "not_configured" }
  }
  try {
    const token = await mintAccessToken(msg.impersonateUser)
    const raw = buildRawMessage(msg)
    const res = await fetch(GMAIL_SEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw }),
    })
    if (!res.ok) {
      const errBody = await res.text()
      console.error(`[mail:${context}] send failed`, { status: res.status, body: errBody })
      return { ok: false, status: res.status, message: errBody }
    }
    return { ok: true, status: res.status }
  } catch (error) {
    console.error(`[mail:${context}] send exception`, error)
    return {
      ok: false,
      status: 0,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}
