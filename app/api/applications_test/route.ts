import { NextResponse } from "next/server"
import { normalizeApplication, type NormalizedApplication } from "../../../lib/normalize-application"
import { getJob } from "../../../lib/getJob"

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
            content: `**🧪 テスト応募通知**\n応募ID: ${data.id}\n応募日時: ${appliedDate}`
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

  // testEndpointフラグを除いた完全な生データを表示
  const { testEndpoint, ...fullRawData } = data

  return {
    msg_type: "interactive",
    card: {
      elements: [
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**🧪 テスト生データ応募通知 (完全版)**\n応募ID: ${data.id}\n応募日時: ${appliedDate}`
          }
        },
        {
          tag: "hr"
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**📊 受信した完全な生データ (JSON形式)**\n\`\`\`json\n${JSON.stringify(fullRawData, null, 2)}\n\`\`\``
          }
        }
      ]
    }
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json()

    // job.id の必須チェック
    const jobId: string | undefined = body?.job?.id
    if (!jobId || typeof jobId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Bad Request: job.id is required' },
        { status: 400 }
      )
    }

    // microCMS 上の求人存在確認（存在しなければ 404 を返す）
    try {
      await getJob(jobId)
    } catch (e: any) {
      const status: number | undefined = e?.status || e?.response?.status
      if (status === 404) {
        return NextResponse.json(
          { success: false, message: 'Job Not Found' },
          { status: 404 }
        )
      }
      console.error("[applications_test] Failed to verify job on microCMS:", e)
      return NextResponse.json(
        { success: false, message: 'Upstream error while verifying job' },
        { status: 502 }
      )
    }

    const LARK_WEBHOOK = process.env.LARK_WEBHOOK
    
    if (!LARK_WEBHOOK) {
      console.error("[applications_test] LARK_WEBHOOK environment variable is not set")
      return NextResponse.json(
        { success: false, message: "Webhook configuration error" },
        { status: 500 }
      )
    }

    // テスト用詳細ログ出力
    console.log("=".repeat(80))
    console.log("[applications_test] 🧪 TEST ENDPOINT - Received application data")
    console.log("=".repeat(80))
    console.log("Request Headers:", Object.fromEntries(request.headers.entries()))
    console.log("Request Body:", JSON.stringify(body, null, 2))
    console.log("Timestamp:", new Date().toISOString())
    console.log("=" .repeat(80))

    // テストエンドポイントでは正規化＋可読フォーマットを送る
    console.log("[applications_test] Processing normalized data for Lark")
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
    const rawLarkMessage = formatLarkMessage(mappedForFormatter)
    
    console.log("[applications_test] 📤 Sending normalized data to Lark webhook...")
    console.log("Normalized Lark Message:", JSON.stringify(rawLarkMessage, null, 2))
    
    try {
      const response = await fetch(LARK_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawLarkMessage),
      })

      const responseText = await response.text()
      console.log("[applications_test] 📬 Raw data Lark response status:", response.status)
      console.log("[applications_test] 📬 Raw data Lark response headers:", Object.fromEntries(response.headers.entries()))
      console.log("[applications_test] 📬 Raw data Lark response body:", responseText)

      let parsed: any = null
      try {
        parsed = JSON.parse(responseText)
      } catch (_) {}

      const larkCode: number | undefined = parsed?.code ?? parsed?.StatusCode
      const larkMsg: string | undefined = parsed?.msg ?? parsed?.StatusMessage

      if (!response.ok || (typeof larkCode === 'number' && larkCode !== 0)) {
        console.error("[applications_test] ❌ Lark webhook error for raw data:", {
          httpStatus: response.status,
          body: responseText,
        })
        return NextResponse.json(
          { success: false, message: `Failed to send raw data to Lark: ${response.ok ? 502 : response.status} - ${larkMsg || 'Unknown error'}` },
          { status: response.ok ? 502 : response.status }
        )
      }

      console.log("[applications_test] ✅ Successfully sent raw data to Lark")
    console.log("=".repeat(80))
    } catch (fetchError) {
      console.error("[applications_test] ❌ Network error sending raw data to Lark:", fetchError)
      return NextResponse.json(
        { success: false, message: `Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("[applications_test] ❌ Error processing test application:", error)
    console.error("[applications_test] ❌ Error stack:", error instanceof Error ? error.stack : 'Unknown error')
    console.log("=".repeat(80))
    
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

// テスト用GETエンドポイント（エンドポイント確認用）
export async function GET() {
  const hook = process.env.LARK_WEBHOOK
  const masked = hook ? `${hook.slice(0, 30)}...${hook.slice(-8)}` : undefined
  return NextResponse.json({
    message: "🧪 Test Applications Endpoint",
    status: "active",
    timestamp: new Date().toISOString(),
    description: "This is a test endpoint for application data processing",
    webhook: masked ? { configured: true, masked } : { configured: false },
    usage: {
      method: "POST",
      contentType: "application/json",
      expectedData: {
        id: "string",
        appliedOnMillis: "number",
        job: {
          id: "string",
          title: "string",
          url: "string",
          companyName: "string",
          location: "string"
        },
        applicant: {
          firstName: "string",
          lastName: "string",
          firstNameKana: "string",
          lastNameKana: "string",
          email: "string",
          phone: "string",
          birthday: "string",
          gender: "string",
          address: "string",
          occupation: "string"
        },
        analytics: {
          userAgent: "string",
          ipAddress: "string",
          referrer: "string"
        },
        questionsAndAnswers: "array"
      }
    }
  })
}