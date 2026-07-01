import type { ApplicationFormData } from "@/features/application/types"

export type ApplyContext = {
  applicationSource: string
  jobUrl: string
  utmSource: string
  utmMedium: string
}

export function buildBirthDate(year: string, month: string, day: string): string {
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

// 整備士求人の応募先メール。@/shared/lark/routing の MECHANIC_APPLY_EMAIL と一致させること。
// （routing.ts は larkEnv を import するためクライアントに持ち込まず、値のみ複製している）
const MECHANIC_APPLY_EMAIL = "ridejob.mechanic@pmagent.jp"
const APPLICANTS_BASE = "https://ridejob.pmagent.jp"

/**
 * 応募完了ページのURLを求人種別で出し分ける。
 * - 整備士求人: /mechanic/applicants/new（メカニック予約 mec を埋め込み）
 * - それ以外:   /applicants/new（汎用=RIDEJOB予約 ride を埋め込み）
 * 判定は submit-application 側 detectMechanic と同一基準（完全一致）に合わせ、
 * 完了ページの予約導線を SMS/自動返信メールの種別と一致させる。
 */
export function resolveApplicationCompleteUrl(applyEmail: string | undefined | null): string {
  const isMechanic = applyEmail === MECHANIC_APPLY_EMAIL
  return isMechanic
    ? `${APPLICANTS_BASE}/mechanic/applicants/new`
    : `${APPLICANTS_BASE}/applicants/new`
}

/**
 * 応募送信時のブラウザ依存コンテキスト（source, jobUrl, UTM）を解決する。
 * URL から source が無く localStorage に有効値がある場合は URL を書き戻す。
 * SSR 時は空のコンテキストを返す。
 */
export function resolveApplyContext(): ApplyContext {
  if (typeof window === "undefined") {
    return { applicationSource: "unknown", jobUrl: "", utmSource: "", utmMedium: "" }
  }

  const searchParams = new URLSearchParams(window.location.search)
  const rawSource = searchParams.get("source")
  const normalizedSource = rawSource?.trim().toLowerCase()
  const storedSource = window.localStorage.getItem("application_source")?.trim().toLowerCase()
  const effectiveStoredSource = storedSource && storedSource !== "unknown" ? storedSource : ""
  const applicationSource = normalizedSource || effectiveStoredSource || "unknown"

  const shouldUpdateUrl = Boolean(rawSource)
  if (!rawSource && effectiveStoredSource) {
    searchParams.set("source", effectiveStoredSource)
  }
  let jobUrl = `${window.location.origin}${window.location.pathname}`
  const queryString = searchParams.toString()
  if (queryString) {
    jobUrl = `${jobUrl}?${queryString}`
  }
  if (shouldUpdateUrl && window.history && window.history.replaceState) {
    window.history.replaceState(null, "", jobUrl)
  }

  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=")
    acc[key] = decodeURIComponent(value)
    return acc
  }, {} as Record<string, string>)

  const utmSource = cookies.utm_source || ""
  const utmMedium = cookies.utm_medium || ""

  if (utmSource || utmMedium) {
    console.log("[UTM] Retrieved from cookies:", { utmSource, utmMedium })
  }

  return { applicationSource, jobUrl, utmSource, utmMedium }
}

export async function postApplication(payload: ApplicationFormData & {
  jobId: string
  applyEmail: string
  applicationSource: string
  metaEventId?: string
}): Promise<void> {
  await fetch("/api/submit-application", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

type StandbyCvPayload = {
  jobId: string
  jobName: string
  companyName: string
  jobUrl: string
  source: string
}

/**
 * standby 経由応募時の GTM dataLayer push と STANBY_CV.send を実行する。
 * 呼び出し側で「同一フォーム送信中に1回だけ」のガードを行う前提。
 */
export function pushStandbyCv({ jobId, jobName, companyName, jobUrl, source }: StandbyCvPayload): void {
  if (typeof window === "undefined") return
  const win = window as typeof window & {
    dataLayer?: Record<string, unknown>[]
    STANBY_CV?: { send: (siteCode: string, accountId: string) => void }
  }
  win.dataLayer = win.dataLayer ?? []
  win.dataLayer.push({
    event: "standby_cv_submit",
    jobId,
    jobName,
    companyName,
    jobUrl,
    source,
  })
  if (win.STANBY_CV && win.STANBY_CV.send) {
    win.STANBY_CV.send("ridejob-jp", "2171143810634182656")
  }
}
