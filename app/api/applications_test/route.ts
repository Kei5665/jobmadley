import { NextResponse } from "next/server"

interface Applicant {
  firstName: string
  lastName: string
  firstNameKana: string
  lastNameKana: string
  email: string
  phone: string
  birthday: string
  gender: string
  address: string
  occupation: string
}

interface Job {
  id: string
  title: string
  url: string
  companyName: string
  location: string
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

interface ApplicationData {
  id: string
  appliedOnMillis: number
  job: Job
  applicant: Applicant
  analytics: Analytics
  questionsAndAnswers: QuestionAndAnswer[]
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
            content: `**👤 応募者情報**\n氏名: ${data.applicant.lastName} ${data.applicant.firstName} (${data.applicant.lastNameKana} ${data.applicant.firstNameKana})\n生年月日: ${data.applicant.birthday}\n性別: ${data.applicant.gender === 'male' ? '男性' : '女性'}\n職業: ${data.applicant.occupation}\n住所: ${data.applicant.address}\nメール: ${data.applicant.email}\n電話: ${data.applicant.phone}`
          }
        },
        {
          tag: "hr"
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**💼 求人情報**\n求人タイトル: ${data.job.title}\n会社名: ${data.job.companyName}\n勤務地: ${data.job.location}\n求人URL: ${data.job.url}`
          }
        },
        ...(data.questionsAndAnswers.length > 0 ? [
          {
            tag: "hr"
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**❓ 質問・回答**\n${data.questionsAndAnswers.map(qa => `**${qa.question}**\n${qa.answer}`).join('\n\n')}`
            }
          }
        ] : []),
        {
          tag: "hr"
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**📊 分析情報**\nUser Agent: ${data.analytics.userAgent}\nIP Address: ${data.analytics.ipAddress}\nReferrer: ${data.analytics.referrer}`
          }
        }
      ]
    }
  }
}

export async function POST(request: Request) {
  try {
    const LARK_WEBHOOK = process.env.LARK_WEBHOOK
    
    if (!LARK_WEBHOOK) {
      console.error("[applications_test] LARK_WEBHOOK environment variable is not set")
      return NextResponse.json(
        { success: false, message: "Webhook configuration error" },
        { status: 500 }
      )
    }

    const body: ApplicationData = await request.json()

    // テスト用詳細ログ出力
    console.log("=" .repeat(80))
    console.log("[applications_test] 🧪 TEST ENDPOINT - Received application data")
    console.log("=" .repeat(80))
    console.log("Request Headers:", Object.fromEntries(request.headers.entries()))
    console.log("Request Body:", JSON.stringify(body, null, 2))
    console.log("Timestamp:", new Date().toISOString())
    console.log("=" .repeat(80))

    // データバリデーション詳細チェック
    const validationErrors = []
    if (!body.id) validationErrors.push("Missing application ID")
    if (!body.appliedOnMillis) validationErrors.push("Missing application timestamp")
    if (!body.applicant?.firstName) validationErrors.push("Missing applicant first name")
    if (!body.applicant?.lastName) validationErrors.push("Missing applicant last name")
    if (!body.applicant?.email) validationErrors.push("Missing applicant email")
    if (!body.job?.id) validationErrors.push("Missing job ID")
    if (!body.job?.title) validationErrors.push("Missing job title")

    if (validationErrors.length > 0) {
      console.error("[applications_test] ❌ Validation errors:", validationErrors)
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation failed", 
          errors: validationErrors,
          receivedData: body
        },
        { status: 400 }
      )
    }

    const larkMessage = formatLarkMessage(body)

    console.log("[applications_test] 📤 Sending to Lark webhook...")
    console.log("Lark Message:", JSON.stringify(larkMessage, null, 2))

    const response = await fetch(LARK_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(larkMessage),
    })

    console.log("[applications_test] 📬 Lark response status:", response.status)
    console.log("[applications_test] 📬 Lark response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[applications_test] ❌ Lark webhook error:", errorText)
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to send to Lark",
          larkResponse: {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          },
          sentData: larkMessage
        },
        { status: response.status }
      )
    }

    const responseText = await response.text()
    console.log("[applications_test] ✅ Lark response body:", responseText)
    console.log("[applications_test] ✅ Successfully sent to Lark")
    console.log("=" .repeat(80))

    return NextResponse.json({ 
      success: true,
      message: "Test application processed successfully",
      processedData: {
        applicationId: body.id,
        applicantName: `${body.applicant.lastName} ${body.applicant.firstName}`,
        jobTitle: body.job.title,
        processedAt: new Date().toISOString()
      },
      larkResponse: {
        status: response.status,
        body: responseText
      }
    })

  } catch (error) {
    console.error("[applications_test] ❌ Error processing test application:", error)
    console.error("[applications_test] ❌ Error stack:", error instanceof Error ? error.stack : 'Unknown error')
    console.log("=" .repeat(80))
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// テスト用GETエンドポイント（エンドポイント確認用）
export async function GET() {
  return NextResponse.json({
    message: "🧪 Test Applications Endpoint",
    status: "active",
    timestamp: new Date().toISOString(),
    description: "This is a test endpoint for application data processing",
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