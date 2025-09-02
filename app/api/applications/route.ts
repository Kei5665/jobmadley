import { NextResponse } from "next/server"
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
            content: `**🎯 求人ボックスから応募がありました！`
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
        },
        ...((data.questionsAndAnswers && Array.isArray(data.questionsAndAnswers) && data.questionsAndAnswers.length > 0) ||
             (data.questionsAndAnswers && !Array.isArray(data.questionsAndAnswers) && (data.questionsAndAnswers as QuestionsAndAnswersWrapper).questionsAndAnswers && (data.questionsAndAnswers as QuestionsAndAnswersWrapper).questionsAndAnswers.length > 0) ? [
          {
            tag: "hr"
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**❓ 質問・回答**\n${(Array.isArray(data.questionsAndAnswers) ? data.questionsAndAnswers : (data.questionsAndAnswers as QuestionsAndAnswersWrapper).questionsAndAnswers || []).map((qa: any, index: number) => `**質問 ${index + 1}:** ${qa.question}\n**回答:** ${qa.answer}`).join('\n\n')}`
            }
          }
        ] : [])
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

export async function POST(request: Request) {
  try {
    const body: any = await request.json()

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
        return NextResponse.json(
          { success: false, message: 'Job Not Found' },
          { status: 404 }
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

    const LARK_WEBHOOK = process.env.LARK_WEBHOOK
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
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("[applications] Error processing application:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}