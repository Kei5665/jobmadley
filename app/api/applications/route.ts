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

  const formatValue = (value: string | undefined, defaultValue: string = 'undefined'): string => {
    return value && value !== 'undefined' ? value : defaultValue
  }

  const formatName = (lastName: string, firstName: string, lastNameKana: string, firstNameKana: string): string => {
    const fullName = `${formatValue(lastName)} ${formatValue(firstName)}`
    const fullNameKana = `${formatValue(lastNameKana)} ${formatValue(firstNameKana)}`

    if (lastNameKana !== 'undefined' && firstNameKana !== 'undefined' && lastNameKana && firstNameKana) {
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
            content: `**👤 応募者情報**\n氏名: ${formatName(data.applicant.lastName, data.applicant.firstName, data.applicant.pronunciationLastName, data.applicant.pronunciationFirstName)}\n生年月日: ${formatValue(data.applicant.birthday)}\n性別: ${data.applicant.gender === 'male' || data.applicant.gender === '男性' ? '男性' : data.applicant.gender === 'female' || data.applicant.gender === '女性' ? '女性' : formatValue(data.applicant.gender)}\n職業: ${formatValue(data.applicant.occupation)}\n住所: ${formatValue(data.applicant.prefecture)}${data.applicant.city ? ` ${data.applicant.city}` : ''}\nメール: ${formatValue(data.applicant.email)}\n電話: ${formatValue(data.applicant.phone || data.applicant.phoneNumber)}`
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
             (data.questionsAndAnswers && data.questionsAndAnswers.questionsAndAnswers && data.questionsAndAnswers.questionsAndAnswers.length > 0) ? [
          {
            tag: "hr"
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**❓ 質問・回答**\n${(Array.isArray(data.questionsAndAnswers) ? data.questionsAndAnswers : data.questionsAndAnswers.questionsAndAnswers || []).map((qa: any, index: number) => `**質問 ${index + 1}:** ${qa.question}\n**回答:** ${qa.answer}`).join('\n\n')}`
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

    // テストモード: 求人ボックス連携テスト用の強制分岐
    // APPLY_TEST_MODE=1 のときも Lark 通知を行った上で、job.id に応じて固定ステータスを返す
    if (process.env.APPLY_TEST_MODE === '1') {
      // job.id（変換後）と job.jobId（生データ）どちらでも判定できるように両対応
      const jobId: string | undefined = body?.job?.id ?? body?.job?.jobId
      const forcedStatus = jobId === 'test-404' ? 404 : jobId === 'test-410' ? 410 : 200

      // テストモードでも通知を実施（失敗しても固定レスポンスは維持）
      const LARK_WEBHOOK = process.env.LARK_WEBHOOK
      if (LARK_WEBHOOK) {
        try {
          const payload = body.isRawData ? formatRawDataMessage(body) : formatLarkMessage(body)
          const response = await fetch(LARK_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
          if (!response.ok) {
            console.error("[applications][test-mode] Lark webhook error:", response.status)
          }
        } catch (e) {
          console.error("[applications][test-mode] Failed to send to Lark:", e)
        }
      } else {
        console.warn("[applications][test-mode] LARK_WEBHOOK is not set. Skipping notification.")
      }

      if (forcedStatus === 404) {
        return NextResponse.json(
          { success: false, message: 'Job Not Found' },
          { status: 404 }
        )
      }
      if (forcedStatus === 410) {
        return NextResponse.json(
          { success: false, message: 'Job Expired' },
          { status: 410 }
        )
      }
      return NextResponse.json(
        { success: true, message: 'OK' },
        { status: 200 }
      )
    }

    console.log("[applications] Received application data:", body)

    // ここから先はテストモードではなく通常フロー。
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

    // 通常の変換済みデータの処理
    const larkMessage = formatLarkMessage(body)

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