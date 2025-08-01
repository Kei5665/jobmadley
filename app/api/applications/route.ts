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
            content: `**🎯 新規応募通知**\n応募ID: ${data.id}\n応募日時: ${appliedDate}`
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
      console.error("[applications] LARK_WEBHOOK environment variable is not set")
      return NextResponse.json(
        { success: false, message: "Webhook configuration error" },
        { status: 500 }
      )
    }

    const body: ApplicationData = await request.json()

    console.log("[applications] Received application data:", body)

    const larkMessage = formatLarkMessage(body)

    const response = await fetch(LARK_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(larkMessage),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[applications] Lark webhook error:", errorText)
      return NextResponse.json(
        { success: false, message: "Failed to send to Lark" },
        { status: response.status }
      )
    }

    console.log("[applications] Successfully sent to Lark")
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("[applications] Error processing application:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}