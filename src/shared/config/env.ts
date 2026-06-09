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

// Lark Webhook（任意。未設定時はAPI Routeで個別判定）
export const larkEnv = {
  // 内部応募フォーム用
  notification: () => read("LARK_WEBHOOK"),
  notificationCpOne: () => read("LARK_WEBHOOK_CPONE"),
  notificationMechanic: () => read("LARK_WEBHOOK_MECHANIC"),
  // 求人ボックス連携用（外部からの応募）
  notificationCpOneKyujinbox: () => read("LARK_WEBHOOK_CPONE_KYUZINBOX"),
  // Base登録用
  base: () => read("LARK_WEBHOOK_BASE"),
  baseLegacy: () => read("LARK_BASE_WEBHOOK"),
  baseCpOne: () => read("LARK_WEBHOOK_BASE_CPONE"),
  baseCpOneStandby: () => read("LARK_WEBHOOK_BASE_CPONE_STANDBY"),
  baseCpOneKyujinbox: () => read("LARK_WEBHOOK_BASE_CPONE_KYUZINBOX"),
  baseMechanic: () => read("LARK_WEBHOOK_BASE_MECHANIC"),
  baseMechanicStandby: () => read("LARK_WEBHOOK_BASE_MECHANIC_STANDBY"),
  baseMechanicKyujin: () => read("LARK_WEBHOOK_BASE_MECHANIC_KYUJIN"),
  // お問い合わせフォーム用（必須化：従来はハードコードフォールバックがあったが廃止）
  contact: () => requireEnv("LARK_CONTACT_WEBHOOK"),
}

// Gmail API（応募者向け自動返信。サービスアカウント + ドメインワイド委任）
// すべて任意。未設定時はメール送信をスキップする（応募処理は継続）。
export const gmailEnv = {
  /** サービスアカウントの client_email */
  clientEmail: () => read("GMAIL_SA_CLIENT_EMAIL"),
  /** サービスアカウントの private_key（PEM。改行は \n エスケープ可） */
  privateKey: () => {
    const raw = read("GMAIL_SA_PRIVATE_KEY")
    return raw ? raw.replace(/\\n/g, "\n") : undefined
  },
  // From / impersonate 先はメール種別ごとにプロファイルで指定する（applicantAutoReply.ts）。
  /** 設定が揃っているか（送信可否の判定に使用） */
  isConfigured: () => Boolean(read("GMAIL_SA_CLIENT_EMAIL") && read("GMAIL_SA_PRIVATE_KEY")),
}

// SMS（応募者向け自動SMS。CPaaS NOW を直送し、eeasy /api/sms/log に記録）
// すべて任意。CPAASNOW_API_TOKEN 未設定時は送信スキップ（応募処理は継続）。
// SMS_LOG_SECRET 未設定時は送信のみ行い eeasy への記録はスキップする。
export const smsEnv = {
  /** CPaaS NOW APIトークン（未設定なら送信しない） */
  cpaasToken: () => read("CPAASNOW_API_TOKEN"),
  /** CPaaS NOW エンドポイント（未設定ならサンドボックス＝実SMSは飛ばない） */
  cpaasBaseUrl: () => read("CPAASNOW_BASE_URL") ?? "https://sandbox.cpaasnow.com",
  /** 予約URLの基盤（?ref で送信→予約を突合） */
  bookingBaseUrl: () => read("SMS_BOOKING_BASE_URL") ?? "https://leomeet.pmagent.jp",
  /** eeasy 本体（送信ログ /api/sms/log の宛先） */
  eeasyBaseUrl: () => read("EEASY_BASE_URL") ?? "https://leomeet.pmagent.jp",
  /** eeasy /api/sms/log 用 Bearer（未設定なら記録スキップ） */
  logSecret: () => read("SMS_LOG_SECRET"),
  /** 送信可否（トークンが揃っているか） */
  isConfigured: () => Boolean(read("CPAASNOW_API_TOKEN")),
}

// その他
export const previewSecret = () => read("MICROCMS_PREVIEW_SECRET")
export const siteUrl = () => read("NEXT_PUBLIC_SITE_URL")
