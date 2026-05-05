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

// その他
export const previewSecret = () => read("MICROCMS_PREVIEW_SECRET")
export const siteUrl = () => read("NEXT_PUBLIC_SITE_URL")
