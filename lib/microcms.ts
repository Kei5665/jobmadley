import { createClient } from "microcms-js-sdk"

// サーバーサイドのみで利用するクライアント
//   NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN  : microCMS のサービスドメイン (例: your-service)
//   MICROCMS_API_KEY                     : 管理画面 -> API キー
// フロント側に API キーを漏らさないように、API キーは NEXT_PUBLIC を付けずに環境変数を設定してください。

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    const message = `${name} が環境変数に設定されていません`
    console.error(`[microCMS:config] ${message}`)
    throw new Error(message)
  }
  return value
}

const serviceDomain = requireEnv("NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN")
const apiKey = requireEnv("MICROCMS_API_KEY")

export const microcmsClient = createClient({
  serviceDomain,
  apiKey,
})

// === 第２サービス: タクシー運転手メディア ===
const serviceDomain2 = requireEnv("NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN_2")
const apiKey2 = requireEnv("MICROCMS_API_KEY_2")

export const microcmsClient2 = createClient({
  serviceDomain: serviceDomain2,
  apiKey: apiKey2,
})
