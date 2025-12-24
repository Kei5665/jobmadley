import { NextResponse } from "next/server"
import { appendFile } from "fs/promises"
import path from "path"
import { normalizeApplication, type NormalizedApplication } from "../../../lib/normalize-application"
import { microcmsClient } from "../../../lib/microcms"
import type { MicroCMSListResponse } from "../../../lib/types"

interface Applicant {
  firstName: string
  lastName: string
  firstNameKana?: string
  lastNameKana?: string
  pronunciationFirstName?: string
  pronunciationLastName?: string
  email: string
  phone?: string
  phoneNumber?: string
  birthday: string
  gender: string
  address?: string
  prefecture?: string
  city?: string
  occupation: string
  fullName?: string
  pronunciationFullName?: string
  coverLetter?: string
}

interface Job {
  id?: string
  title?: string
  url?: string
  companyName?: string
  location?: string
  jobId?: string
  jobTitle?: string
  jobUrl?: string
  jobCompany?: string
  jobLocation?: string
}

interface Analytics {
  userAgent: string
  ipAddress: string
  referrer: string
}

interface QuestionAndAnswer {
  questionId: string
  question: string
  answer: string
}

interface QuestionsAndAnswersWrapper {
  url?: string
  retrievedOnMillis?: number
  questionsAndAnswers: QuestionAndAnswer[]
}

interface ApplicationData {
  id: string
  appliedOnMillis: number
  job: Job
  applicant: Applicant
  analytics: Analytics
  questionsAndAnswers: QuestionAndAnswer[] | QuestionsAndAnswersWrapper
}

function formatLarkMessage(data: ApplicationData): any {
  const appliedDate = new Date(data.appliedOnMillis).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  const formatValue = (value: string | undefined | null, defaultValue: string = '未設定'): string => {
    return value && value !== 'undefined' && value !== '' ? value : defaultValue
  }

  const formatName = (lastName: string | undefined, firstName: string | undefined, lastNameKana?: string, firstNameKana?: string): string => {
    const fullName = `${formatValue(lastName)} ${formatValue(firstName)}`
    const fullNameKana = `${formatValue(lastNameKana)} ${formatValue(firstNameKana)}`

    if (lastNameKana && firstNameKana && lastNameKana !== 'undefined' && firstNameKana !== 'undefined') {
      return `${fullName} (${fullNameKana})`
    }
    return fullName
  }

  return {
    msg_type: "interactive",
    card: {
      elements: [
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `🎯 求人ボックスから応募がありました！`
          }
        },
        {
          tag: "hr"
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**👤 応募者情報**\n氏名: ${formatName(data.applicant.lastName, data.applicant.firstName, data.applicant.pronunciationLastName, data.applicant.pronunciationFirstName)}\n生年月日: ${formatValue(data.applicant.birthday)}\n性別: ${data.applicant.gender === 'male' || data.applicant.gender === '男性' ? '男性' : data.applicant.gender === 'female' || data.applicant.gender === '女性' ? '女性' : formatValue(data.applicant.gender)}\n職業: ${formatValue(data.applicant.occupation)}\n住所: ${formatValue(data.applicant.prefecture || '')}${data.applicant.city ? ` ${data.applicant.city}` : ''}\nメール: ${formatValue(data.applicant.email)}\n電話: ${formatValue(data.applicant.phone || data.applicant.phoneNumber || '')}`
          }
        },
        {
          tag: "hr"
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**💼 求人情報**\n求人ID: ${formatValue(data.job.id || data.job.jobId)}\n求人タイトル: ${formatValue(data.job.title || data.job.jobTitle)}\n会社名: ${formatValue(data.job.companyName || data.job.jobCompany)}\n勤務地: ${formatValue(data.job.location || data.job.jobLocation)}\n求人URL: ${formatValue(data.job.url || data.job.jobUrl)}`
          }
        }
      ]
    }
  }
}

function formatRawDataMessage(data: any): any {
  const appliedDate = new Date(data.appliedOnMillis || Date.now()).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  return {
    msg_type: "interactive",
    card: {
      elements: [
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**📋 生データ応募通知**\n応募ID: ${data.id}\n応募日時: ${appliedDate}`
          }
        },
        {
          tag: "hr"
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**📊 受信した生データ (JSON形式)**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
          }
        }
      ]
    }
  }
}

function formatErrorLarkMessage(title: string, description: string, details?: unknown): any {
  const elements: any[] = [
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: `**${title}**\n${description}`
      }
    }
  ]

  if (details != null) {
    elements.push({ tag: "hr" })
    if (typeof details === 'string') {
      elements.push({
        tag: "div",
        text: { tag: "lark_md", content: details }
      })
    } else {
      elements.push({
        tag: "div",
        text: {
          tag: "lark_md",
          content: `\`\`\`json\n${JSON.stringify(details, null, 2)}\n\`\`\``
        }
      })
    }
  }

  return {
    msg_type: "interactive",
    card: { elements }
  }
}

function buildLarkBasePayloadFromNormalized(normalized: NormalizedApplication, rawBody: any): any {
  const applicant = normalized.applicant
  const job = normalized.job

  const fullName = `${applicant.lastName || ''} ${applicant.firstName || ''}`.trim()
  const fullNameKana = `${applicant.lastNameKana || ''} ${applicant.firstNameKana || ''}`.trim()
  const appliedIso = new Date(normalized.appliedOnMillis || Date.now()).toISOString()

  const qa = (normalized.questionsAndAnswers || []).map((q) => ({ question: q.question, answer: q.answer }))

  return {
    "応募ID": normalized.id || "",
    "応募日時": appliedIso,
    "求人ID": job.id || "",
    "求人タイトル": job.title || "",
    "求人URL": job.url || "",
    "会社名": job.companyName || "",
    "勤務地": job.location || "",
    "氏名": fullName || "",
    "氏名カナ": fullNameKana || "",
    "メール": applicant.email || "",
    "電話番号": applicant.phone || "",
    "生年月日": applicant.birthday || "",
    "性別": typeof applicant.gender === 'string' ? applicant.gender : "",
    "職業": applicant.occupation || "",
    "都道府県": applicant.prefecture || "",
    "市区町村": applicant.city || "",
    "質問回答": JSON.stringify(qa),
    "UA": rawBody?.analytics?.userAgent || "",
    "リファラ": rawBody?.analytics?.referrer || "",
    "IP": rawBody?.analytics?.ip || rawBody?.analytics?.ipAddress || "",
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json()

    // 整備士かどうかを判定（job.title または job.jobTitle に「整備士」が含まれるか）
    const jobTitle = body?.job?.title || body?.job?.jobTitle || ''
    const isMechanic = jobTitle.toLowerCase().includes('整備士'.toLowerCase())

    // CP One Japan 合同会社かどうかを判定
    const companyName = body?.job?.companyName || body?.job?.jobCompany || ''
    const isCPOne = companyName.includes('CP One Japan 合同会社')

    // Webhook URLを切り替え（優先順位: CP One(求人ボックス用) > 整備士 > デフォルト）
    const LARK_WEBHOOK = (() => {
      if (isCPOne && process.env.LARK_WEBHOOK_CPONE_KYUZINBOX) {
        return process.env.LARK_WEBHOOK_CPONE_KYUZINBOX
      }
      if (isMechanic && process.env.LARK_WEBHOOK_MECHANIC) {
        return process.env.LARK_WEBHOOK_MECHANIC
      }
      return process.env.LARK_WEBHOOK
    })()

    // 受信ボディを dev.log に追記
    try {
      const logPath = path.join(process.cwd(), "dev.log")
      const logEntry = `\n${"=".repeat(80)}\n[${new Date().toISOString()}] [applications] Incoming Request Body\n${JSON.stringify(body, null, 2)}\n`
      await appendFile(logPath, logEntry)
    } catch (fileErr) {
      console.error("[applications] Failed to append incoming body to dev.log:", fileErr)
    }

    // job.id または job.jobId の必須チェック（いずれか必須）
    const jobId: string | undefined = body?.job?.id ?? body?.job?.jobId
    if (!jobId || typeof jobId !== 'string' || jobId.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Bad Request: job.id or job.jobId is required' },
        { status: 400 }
      )
    }


    // microCMS 上の求人存在確認（存在しなければ 404 を返す）
    try {
      const r = await microcmsClient.get<MicroCMSListResponse<{ id: string }>>({
        endpoint: "jobs",
        queries: { limit: 0, filters: `id[equals]${jobId}` },
      })
      if (!r || typeof r.totalCount !== 'number' || r.totalCount === 0) {
        // 求人未存在をLarkに通知（Webhookが設定されている場合のみ）
        if (LARK_WEBHOOK) {
          try {
            const format = (value: unknown, fallback = '未設定') => {
              if (typeof value === 'string' && value.trim() !== '' && value !== 'undefined') return value
              return fallback
            }

            const applicantName = ((): string => {
              const full = `${format(body?.applicant?.lastName, '')} ${format(body?.applicant?.firstName, '')}`.trim()
              if (full) return full
              return format(body?.applicant?.fullName)
            })()
            const applicantKana = ((): string => {
              const kana = `${format(body?.applicant?.lastNameKana, '')} ${format(body?.applicant?.firstNameKana, '')}`.trim()
              if (kana) return kana
              const pron = `${format(body?.applicant?.pronunciationLastName, '')} ${format(body?.applicant?.pronunciationFirstName, '')}`.trim()
              return pron || '未設定'
            })()
            const applicantAddress = ((): string => {
              if (format(body?.applicant?.address, '') !== '') return String(body?.applicant?.address)
              const joined = [body?.applicant?.prefecture, body?.applicant?.city].filter(Boolean).join(' ')
              return joined || '未設定'
            })()
            const applicantPhone = body?.applicant?.phone ?? body?.applicant?.phoneNumber ?? ''

            const jobTitle = body?.job?.title ?? body?.job?.jobTitle
            const company = body?.job?.companyName ?? body?.job?.jobCompany
            const location = body?.job?.location ?? body?.job?.jobLocation

            const detailsText = [
              `求人タイトル: ${format(jobTitle)}`,
              `会社名: ${format(company)}`,
              `勤務地: ${format(location)}`,
              ``,
              `**応募者情報**`,
              `氏名: ${format(applicantName)}`,
              `ふりがな: ${format(applicantKana)}`,
              `生年月日: ${format(body?.applicant?.birthday)}`,
              `住所: ${format(applicantAddress)}`,
              `電話番号: ${format(applicantPhone)}`
            ].join('\n')

            const errorMessage = formatErrorLarkMessage(
              "❌ 求人未存在エラー",
              "求人ボックスから応募がありましたが、ライドジョブ内で求人が見つかりませんでした。",
              detailsText
            )
            const notifyRes = await fetch(LARK_WEBHOOK, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(errorMessage),
            })
            const notifyText = await notifyRes.text()
            if (!notifyRes.ok) {
              console.error("[applications] Failed to notify not-found to Lark:", notifyText)
            }
          } catch (notifyErr) {
            console.error("[applications] Error while notifying not-found to Lark:", notifyErr)
          }
        }
        // 2xxでリトライ抑止
        return NextResponse.json(
          { success: true, error: 'JOB_NOT_FOUND', notification: LARK_WEBHOOK ? { sent: true } : { sent: false, reason: 'Webhook not configured' } },
          { status: 200 }
        )
      }
    } catch (e) {
      console.error("[applications] Failed to verify job on microCMS (list check):", e)
      return NextResponse.json(
        { success: false, message: 'Upstream error while verifying job' },
        { status: 502 }
      )
    }

    console.log("[applications] Received application data:", body)

    if (!LARK_WEBHOOK) {
      console.error("[applications] LARK_WEBHOOK environment variable is not set")
      return NextResponse.json(
        { success: false, message: "Webhook configuration error" },
        { status: 500 }
      )
    }

    // 生データの場合は特別な処理
    if (body.isRawData) {
      console.log("[applications] Processing raw data for Lark")
      const rawLarkMessage = formatRawDataMessage(body)
      
      const response = await fetch(LARK_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawLarkMessage),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[applications] Lark webhook error for raw data:", errorText)
        return NextResponse.json(
          { success: false, message: "Failed to send raw data to Lark" },
          { status: response.status }
        )
      }

      console.log("[applications] Successfully sent raw data to Lark")
      return NextResponse.json({ success: true })
    }

    // 受信データを正規化してから通知用データにマッピング
    const normalized: NormalizedApplication = normalizeApplication(body)

    const mappedForFormatter: ApplicationData = {
      id: normalized.id ?? "",
      appliedOnMillis: normalized.appliedOnMillis ?? Date.now(),
      job: {
        id: normalized.job.id,
        title: normalized.job.title,
        url: normalized.job.url,
        companyName: normalized.job.companyName,
        location: normalized.job.location,
      },
      applicant: {
        firstName: normalized.applicant.firstName,
        lastName: normalized.applicant.lastName,
        firstNameKana: normalized.applicant.firstNameKana ?? "",
        lastNameKana: normalized.applicant.lastNameKana ?? "",
        email: normalized.applicant.email,
        phone: normalized.applicant.phone ?? "",
        birthday: normalized.applicant.birthday ?? "",
        gender: typeof normalized.applicant.gender === 'string' ? normalized.applicant.gender : "",
        prefecture: normalized.applicant.prefecture ?? "",
        city: normalized.applicant.city ?? "",
        address: [normalized.applicant.prefecture, normalized.applicant.city].filter(Boolean).join(" "),
        occupation: normalized.applicant.occupation ?? "",
      },
      analytics: {
        userAgent: body?.analytics?.userAgent ?? "",
        ipAddress: body?.analytics?.ip ?? body?.analytics?.ipAddress ?? "",
        referrer: body?.analytics?.referrer ?? "",
      },
      questionsAndAnswers: (normalized.questionsAndAnswers || []).map((qa, idx) => ({
        questionId: String(idx + 1),
        question: qa.question,
        answer: qa.answer,
      })),
    }

    const larkMessage = formatLarkMessage(mappedForFormatter)

    const response = await fetch(LARK_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(larkMessage),
    })

    // LarkはHTTP 200でも本文のcodeが非0でエラーを返すことがある
    const responseText = await response.text()
    let parsed: any = null
    try {
      parsed = JSON.parse(responseText)
    } catch (_) {
      // 本文がJSONでない場合はそのまま扱う
    }

    const larkCode: number | undefined = parsed?.code ?? parsed?.StatusCode
    const larkMsg: string | undefined = parsed?.msg ?? parsed?.StatusMessage

    if (!response.ok || (typeof larkCode === 'number' && larkCode !== 0)) {
      console.error("[applications] Lark webhook error:", {
        httpStatus: response.status,
        body: responseText,
      })
      return NextResponse.json(
        { success: false, message: larkMsg || "Failed to send to Lark" },
        { status: response.ok ? 502 : response.status }
      )
    }

    console.log("[applications] Successfully sent to Lark", { body: responseText })

    // Lark通知が成功したら、Lark BaseのWebhookにも登録（設定されている場合のみ）
    const LARK_BASE_WEBHOOK = (() => {
      if (isCPOne && process.env.LARK_WEBHOOK_BASE_CPONE_KYUZINBOX) {
        return process.env.LARK_WEBHOOK_BASE_CPONE_KYUZINBOX
      }
      if (isMechanic && process.env.LARK_WEBHOOK_BASE_MECHANIC_KYUJIN) {
        return process.env.LARK_WEBHOOK_BASE_MECHANIC_KYUJIN
      }
      return process.env.LARK_BASE_WEBHOOK
    })()
    if (!LARK_BASE_WEBHOOK) {
      return NextResponse.json({ success: true, base: { sent: false, reason: 'Base webhook not configured' } })
    }

    try {
      const baseFields = buildLarkBasePayloadFromNormalized(normalized, body)
      const baseBody = JSON.stringify(baseFields)
      console.log("[applications] Posting to Lark Base webhook with payload:", baseBody)
      // Base 送信ペイロードを dev.log に追記
      try {
        const logPath = path.join(process.cwd(), "dev.log")
        const logEntry = `\n${"-".repeat(80)}\n[${new Date().toISOString()}] [applications] Lark Base Payload\n${baseBody}\n`
        await appendFile(logPath, logEntry)
      } catch (fileErr) {
        console.error("[applications] Failed to append base payload to dev.log:", fileErr)
      }
      const baseRes = await fetch(LARK_BASE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: baseBody,
      })
      const baseText = await baseRes.text()
      let baseParsed: any = null
      try { baseParsed = JSON.parse(baseText) } catch (_) {}
      const baseCode: number | undefined = baseParsed?.code
      const baseMsg: string | undefined = baseParsed?.msg
      if (!baseRes.ok || (typeof baseCode === 'number' && baseCode !== 0)) {
        console.error("[applications] Lark Base webhook error:", { status: baseRes.status, body: baseText, code: baseCode, msg: baseMsg })
        return NextResponse.json({ success: true, base: { sent: false, status: baseRes.status, code: baseCode, msg: baseMsg } })
      }
      return NextResponse.json({ success: true, base: { sent: true, status: baseRes.status, code: baseCode ?? 0 } })
    } catch (baseErr) {
      console.error("[applications] Error posting to Lark Base webhook:", baseErr)
      return NextResponse.json({ success: true, base: { sent: false, error: 'network_or_runtime_error' } })
    }

  } catch (error) {
    console.error("[applications] Error processing application:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}