import { createClient } from "microcms-js-sdk"
import { microcmsEnv, microcmsMediaEnv } from "@/shared/config/env"

// サーバーサイド専用 microCMS クライアント。
// API キー漏洩を防ぐため NEXT_PUBLIC_ プレフィックスは付けない。

export const microcmsClient = createClient(microcmsEnv())

// === 第２サービス: タクシー運転手メディア ===
export const microcmsClient2 = createClient(microcmsMediaEnv())
