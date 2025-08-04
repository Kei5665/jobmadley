import { NextResponse } from "next/server"

interface ApplicationFormData {
  lastName: string
  firstName: string
  lastNameKana: string
  firstNameKana: string
  birthDate: string
  phone: string
  email: string
  address: string
  companyName: string
  jobName: string
  jobUrl: string
  jobId?: string
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
  questionsAndAnswers: []
}

function transformApplicationData(formData: ApplicationFormData, request: Request): ApplicationData {
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const referrer = request.headers.get('referer') || 'direct'

  return {
    id: `AT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    appliedOnMillis: Date.now(),
    job: {
      id: formData.jobId || 'unknown',
      title: formData.jobName || 'unknown',
      url: formData.jobUrl || 'unknown',
      companyName: formData.companyName || 'unknown',
      location: 'unknown'
    },
    applicant: {
      firstName: formData.firstName || 'unknown',
      lastName: formData.lastName || 'unknown',
      firstNameKana: formData.firstNameKana || 'unknown',
      lastNameKana: formData.lastNameKana || 'unknown',
      email: formData.email || 'unknown',
      phone: formData.phone || 'unknown',
      birthday: formData.birthDate || 'unknown',
      gender: 'unknown',
      address: formData.address || 'unknown',
      occupation: 'unknown'
    },
    analytics: {
      userAgent,
      ipAddress,
      referrer
    },
    questionsAndAnswers: []
  }
}

export async function POST(request: Request) {
  try {
    const formData: ApplicationFormData = await request.json()

    console.log("[submit-application] Received form data:", formData)

    const transformedData = transformApplicationData(formData, request)
    
    console.log("[submit-application] Transformed data for Lark:", transformedData)

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
      console.error("[submit-application] Applications API error:", text)
      return NextResponse.json({ success: false, message: text }, { status: res.status })
    }

    console.log("[submit-application] Successfully sent to applications API")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[submit-application] Error:", error)
    return NextResponse.json({ success: false, message: "internal error" }, { status: 500 })
  }
} 