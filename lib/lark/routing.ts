// 求人種別／応募経路に応じた Webhook URL の選択ロジックを集約。
// submit-application（内部フォーム）と applications（求人ボックス連携）で共通利用される。

import { larkEnv } from "../config/env"

export interface JobClassification {
  /** 整備士求人かどうか（applyEmail で判定済み） */
  isMechanic: boolean
  /** CP One Japan 合同会社の求人かどうか（companyName で判定） */
  isCpOne: boolean
  /** 応募経路がスタンバイか（applicationSource または jobUrl から判定） */
  isStandby?: boolean
  /** 応募経路が求人ボックスか */
  isKyujinbox?: boolean
}

/** companyName から CP One 判定 */
export const detectCpOne = (companyName: string | undefined | null): boolean =>
  typeof companyName === "string" && companyName.includes("CP One Japan")

/** applyEmail から整備士判定 */
export const MECHANIC_APPLY_EMAIL = "ridejob.mechanic@pmagent.jp"
export const detectMechanic = (applyEmail: string | undefined | null): boolean =>
  applyEmail === MECHANIC_APPLY_EMAIL

/** applicationSource または jobUrl から流入経路を正規化 */
export const normalizeSource = (
  applicationSource: string | undefined,
  jobUrl: string | undefined,
): string | undefined => {
  const fromSource = applicationSource?.trim().toLowerCase()
  if (fromSource) return fromSource
  if (typeof jobUrl === "string" && jobUrl.includes("source=standby")) return "standby"
  return undefined
}

// === submit-application（内部フォーム）用 ===

/**
 * 通知Webhook URL を選択（内部フォーム）。
 * 優先順: CP One > 整備士 > デフォルト
 */
export const resolveSubmitNotificationWebhook = ({
  isCpOne,
  isMechanic,
}: JobClassification): { url: string | undefined; type: string } => {
  if (isCpOne) return { url: larkEnv.notificationCpOne(), type: "LARK_WEBHOOK_CPONE" }
  if (isMechanic) return { url: larkEnv.notificationMechanic(), type: "LARK_WEBHOOK_MECHANIC" }
  return { url: larkEnv.notification(), type: "LARK_WEBHOOK" }
}

/**
 * Base登録Webhook URL を選択（内部フォーム）。
 * CP One/整備士 × スタンバイ の組み合わせを考慮。
 */
export const resolveSubmitBaseWebhook = ({
  isCpOne,
  isMechanic,
  isStandby,
}: JobClassification): { url: string | undefined; type: string } => {
  if (isCpOne) {
    if (isStandby && larkEnv.baseCpOneStandby()) {
      return { url: larkEnv.baseCpOneStandby(), type: "LARK_WEBHOOK_BASE_CPONE_STANDBY" }
    }
    return { url: larkEnv.baseCpOne(), type: "LARK_WEBHOOK_BASE_CPONE" }
  }
  if (isMechanic && isStandby) {
    return { url: larkEnv.baseMechanicStandby(), type: "LARK_WEBHOOK_BASE_MECHANIC_STANDBY" }
  }
  if (isMechanic) {
    return { url: larkEnv.baseMechanic(), type: "LARK_WEBHOOK_BASE_MECHANIC" }
  }
  return { url: larkEnv.base(), type: "LARK_WEBHOOK_BASE" }
}

// === applications（求人ボックス連携）用 ===

/**
 * 通知Webhook URL を選択（求人ボックス連携）。
 * 優先順: CP One(求人ボックス用) > 整備士 > デフォルト
 */
export const resolveKyujinboxNotificationWebhook = ({
  isCpOne,
  isMechanic,
}: JobClassification): string | undefined => {
  if (isCpOne && larkEnv.notificationCpOneKyujinbox()) return larkEnv.notificationCpOneKyujinbox()
  if (isMechanic && larkEnv.notificationMechanic()) return larkEnv.notificationMechanic()
  return larkEnv.notification()
}

/** Base登録Webhook URL を選択（求人ボックス連携）。 */
export const resolveKyujinboxBaseWebhook = ({
  isCpOne,
  isMechanic,
}: JobClassification): string | undefined => {
  if (isCpOne && larkEnv.baseCpOneKyujinbox()) return larkEnv.baseCpOneKyujinbox()
  if (isMechanic && larkEnv.baseMechanicKyujin()) return larkEnv.baseMechanicKyujin()
  return larkEnv.baseLegacy()
}
