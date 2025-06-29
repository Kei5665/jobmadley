import { createClient } from "microcms-js-sdk"

// サーバーサイドのみで利用するクライアント
//   NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN  : microCMS のサービスドメイン (例: your-service)
//   MICROCMS_API_KEY                     : 管理画面 -> API キー
// フロント側に API キーを漏らさないように、API キーは NEXT_PUBLIC を付けずに環境変数を設定してください。

if (!process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN) {
  throw new Error("NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN が環境変数に設定されていません")
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY が環境変数に設定されていません")
}

export const microcmsClient = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
})

// === 第２サービス: タクシー運転手メディア ===
if (!process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN_2) {
  throw new Error("NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN_2 が環境変数に設定されていません")
}
if (!process.env.MICROCMS_API_KEY_2) {
  throw new Error("MICROCMS_API_KEY_2 が環境変数に設定されていません")
}

export const microcmsClient2 = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN_2,
  apiKey: process.env.MICROCMS_API_KEY_2,
}) 