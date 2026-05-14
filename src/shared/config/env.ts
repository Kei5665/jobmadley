// 環境変数アクセスを一元化する。必須/任意を明示し、必須が欠けていれば即座に失敗させる。

const read = (name: string): string | undefined => {
  const value = process.env[name]
  return value && value.length > 0 ? value : undefined
}

const requireEnv = (name: string): string => {
  const value = read(name)
  if (!value) {
    const message = `${name} が環境変数に設定されていません`
    console.error(`[env] ${message}`)
    throw new Error(message)
  }
  return value
}

// microCMS（ビルド時/起動時に必須）
export const microcmsEnv = () => ({
  serviceDomain: requireEnv("NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN"),
  apiKey: requireEnv("MICROCMS_API_KEY"),
})

export const microcmsMediaEnv = () => ({
  serviceDomain: requireEnv("NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN_2"),
  apiKey: requireEnv("MICROCMS_API_KEY_2"),
})

// Lark Webhook（通知用のみ。Base登録は bitable API に移行）
export const larkEnv = {
  // 通知 Webhook（内部応募フォーム用）
  notification: () => read("LARK_WEBHOOK"),
  notificationCpOne: () => read("LARK_WEBHOOK_CPONE"),
  notificationMechanic: () => read("LARK_WEBHOOK_MECHANIC"),
  // 通知 Webhook（求人ボックス連携用）
  notificationCpOneKyujinbox: () => read("LARK_WEBHOOK_CPONE_KYUZINBOX"),
  // お問い合わせフォーム用（必須）
  contact: () => requireEnv("LARK_CONTACT_WEBHOOK"),
  // エラー検知用（Base 登録失敗などをこの Webhook に通知）
  errorAlert: () => read("LARK_WEBHOOK_ERROR_ALERT"),
}

// Lark Open API 用の認証情報（サービス別）
// 各サービスごとに別 App / 別 Base を使用するため、サービス単位で資格情報を持つ。
export type LarkServiceId = "ridejob" | "mechanic" | "liftjob"

export interface LarkServiceCredentials {
  appId: string
  appSecret: string
  appToken: string
  domain: string
}

const DEFAULT_LARK_DOMAIN = "open.larksuite.com"

const readServiceCredentials = (
  service: LarkServiceId,
  suffix: "RIDEJOB" | "MECHANIC" | "LIFTJOB",
  fallback?: { appId?: string; appSecret?: string; appToken?: string; domain?: string },
): LarkServiceCredentials => {
  const appId = read(`APP_ID_${suffix}`) ?? fallback?.appId
  const appSecret = read(`APP_SECRET_${suffix}`) ?? fallback?.appSecret
  const appToken = read(`APP_TOKEN_${suffix}`) ?? fallback?.appToken
  const domain = read(`LARK_DOMAIN_${suffix}`) ?? fallback?.domain ?? DEFAULT_LARK_DOMAIN
  if (!appId || !appSecret || !appToken) {
    throw new Error(`Lark service "${service}" の認証情報 (APP_ID_${suffix} / APP_SECRET_${suffix} / APP_TOKEN_${suffix}) が未設定です`)
  }
  return { appId, appSecret, appToken, domain }
}

export const larkServiceCredentials = (service: LarkServiceId): LarkServiceCredentials => {
  const fallback = {
    appId: read("LARK_APP_ID"),
    appSecret: read("LARK_APP_SECRET"),
    appToken: read("LARK_BASE_APP_TOKEN"),
    domain: read("LARK_DOMAIN"),
  }
  switch (service) {
    case "ridejob":
      return readServiceCredentials(service, "RIDEJOB", fallback)
    case "mechanic":
      return readServiceCredentials(service, "MECHANIC")
    case "liftjob":
      return readServiceCredentials(service, "LIFTJOB")
  }
}

// その他
export const previewSecret = () => read("MICROCMS_PREVIEW_SECRET")
export const siteUrl = () => read("NEXT_PUBLIC_SITE_URL")
