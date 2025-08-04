import { NextResponse } from "next/server"

interface ActualRequestData {
  id: string
  appliedOnMillis: number
  job: {
    jobId: string
    jobUrl: string
    jobTitle: string
    jobCompany: string
    jobLocation: string
  }
  applicant: {
    fullName: string
    firstName: string
    lastName: string
    pronunciationFullName: string
    pronunciationFirstName: string
    pronunciationLastName: string
    email: string
    phoneNumber: string
    coverLetter: string
    birthday: string
    gender: string
    prefecture: string
    city: string
    occupation: string
  }
  analytics: {
    ip: string
    userAgent: string
    device: string
    sponsored: string
  }
  questionsAndAnswers: {
    url: string
    retrievedOnMillis: number
    questionsAndAnswers: any[]
  }
}

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

interface ApplicationData {
  id: string
  appliedOnMillis: number
  job: Job
  applicant: Applicant
  analytics: Analytics
  questionsAndAnswers: any[]
}

function transformApplicationData(requestData: ActualRequestData): ApplicationData {
  // 日付形式の変換: "2008/04/04" → "2008-04-04"
  const convertDateFormat = (dateStr: string): string => {
    if (!dateStr) return 'unknown'
    return dateStr.replace(/\//g, '-')
  }

  // 住所の組み立て
  const buildAddress = (prefecture: string, city: string): string => {
    if (!prefecture && !city) return 'unknown'
    return `${prefecture || ''}${city || ''}`.trim()
  }

  // 性別の変換
  const convertGender = (gender: string): string => {
    if (gender === '男性') return 'male'
    if (gender === '女性') return 'female'
    return 'unknown'
  }

  return {
    id: requestData.id || `AT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    appliedOnMillis: requestData.appliedOnMillis || Date.now(),
    job: {
      id: requestData.job.jobId || 'unknown',
      title: requestData.job.jobTitle || 'unknown',
      url: requestData.job.jobUrl || 'unknown',
      companyName: requestData.job.jobCompany || 'unknown',
      location: requestData.job.jobLocation || 'unknown'
    },
    applicant: {
      firstName: requestData.applicant.firstName || 'unknown',
      lastName: requestData.applicant.lastName || 'unknown',
      firstNameKana: requestData.applicant.pronunciationFirstName || 'unknown',
      lastNameKana: requestData.applicant.pronunciationLastName || 'unknown',
      email: requestData.applicant.email || 'unknown',
      phone: requestData.applicant.phoneNumber || 'unknown',
      birthday: convertDateFormat(requestData.applicant.birthday),
      gender: convertGender(requestData.applicant.gender),
      address: buildAddress(requestData.applicant.prefecture, requestData.applicant.city),
      occupation: requestData.applicant.occupation || 'unknown'
    },
    analytics: {
      userAgent: requestData.analytics.userAgent || 'unknown',
      ipAddress: requestData.analytics.ip || 'unknown',
      referrer: 'direct'
    },
    questionsAndAnswers: requestData.questionsAndAnswers.questionsAndAnswers || []
  }
}

export async function POST(request: Request) {
  try {
    // 詳細なリクエスト情報をログ出力
    const timestamp = new Date().toISOString()
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const contentLength = request.headers.get('content-length') || 'unknown'
    const xForwardedFor = request.headers.get('x-forwarded-for') || 'unknown'
    const referer = request.headers.get('referer') || 'unknown'
    
    console.log("=".repeat(80))
    console.log(`[INFO] ${timestamp} - submit-application POST Request Received`)
    console.log("=".repeat(80))
    console.log(`[INFO] Environment: ${process.env.NODE_ENV}`)
    console.log(`[INFO] Vercel URL: ${process.env.VERCEL_URL || 'not set'}`)
    console.log(`[INFO] Request Headers:`)
    console.log(`  - User-Agent: ${userAgent}`)
    console.log(`  - Content-Length: ${contentLength}`)
    console.log(`  - X-Forwarded-For: ${xForwardedFor}`)
    console.log(`  - Referer: ${referer}`)
    console.log("=".repeat(80))

    const requestData: ActualRequestData = await request.json()

    console.log("[INFO] Raw Request Data (Pretty Formatted):")
    console.log(JSON.stringify(requestData, null, 2))
    
    console.log("=".repeat(80))
    console.log("[INFO] Key Data Fields:")
    console.log(`  - Request ID: ${requestData.id}`)
    console.log(`  - Applicant Name: ${requestData.applicant?.lastName} ${requestData.applicant?.firstName}`)
    console.log(`  - Applicant Kana: ${requestData.applicant?.pronunciationLastName} ${requestData.applicant?.pronunciationFirstName}`)
    console.log(`  - Phone: ${requestData.applicant?.phoneNumber}`)
    console.log(`  - Email: ${requestData.applicant?.email}`)
    console.log(`  - Job Title: ${requestData.job?.jobTitle}`)
    console.log(`  - Company: ${requestData.job?.jobCompany}`)
    console.log("=".repeat(80))

    const transformedData = transformApplicationData(requestData)
    
    console.log("[INFO] Transformed Data for Lark (Pretty Formatted):")
    console.log(JSON.stringify(transformedData, null, 2))

    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'https://ridejob.jp'

    const res = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("=".repeat(80))
      console.error(`[ERROR] ${new Date().toISOString()} - Applications API Error`)
      console.error(`[ERROR] Status: ${res.status}`)
      console.error(`[ERROR] Response: ${text}`)
      console.error("=".repeat(80))
      return NextResponse.json({ success: false, message: text }, { status: res.status })
    }

    console.log("=".repeat(80))
    console.log(`[SUCCESS] ${new Date().toISOString()} - Successfully sent to applications API`)
    console.log("=".repeat(80))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("=".repeat(80))
    console.error(`[ERROR] ${new Date().toISOString()} - Unexpected Error in submit-application`)
    console.error(`[ERROR] Error Message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    console.error(`[ERROR] Error Stack: ${error instanceof Error ? error.stack : 'No stack trace'}`)
    console.error(`[ERROR] Error Type: ${typeof error}`)
    console.error(`[ERROR] Full Error Object:`, error)
    console.error("=".repeat(80))
    return NextResponse.json({ success: false, message: "internal error" }, { status: 500 })
  }
} 