export type NormalizedQA = { question: string; answer: string }

export type NormalizedJob = {
  id: string
  title: string
  companyName: string
  location: string
  url: string
}

export type NormalizedApplicant = {
  lastName: string
  firstName: string
  lastNameKana?: string
  firstNameKana?: string
  email: string
  phone?: string
  birthday?: string
  gender?: string
  prefecture?: string
  city?: string
  occupation?: string
}

export type NormalizedApplication = {
  id?: string
  appliedOnMillis?: number
  job: NormalizedJob
  applicant: NormalizedApplicant
  questionsAndAnswers: NormalizedQA[]
}

export function normalizeApplication(body: any): NormalizedApplication {
  const job = body?.job ?? {}
  const applicant = body?.applicant ?? {}
  const rawQA = body?.questionsAndAnswers

  const qaArray: any[] = Array.isArray(rawQA)
    ? rawQA
    : Array.isArray(rawQA?.questionsAndAnswers)
      ? rawQA.questionsAndAnswers
      : []

  return {
    id: body?.id,
    appliedOnMillis: body?.appliedOnMillis,
    job: {
      id: job?.id ?? job?.jobId ?? '',
      title: job?.title ?? job?.jobTitle ?? '',
      companyName: job?.companyName ?? job?.jobCompany ?? '',
      location: job?.location ?? job?.jobLocation ?? '',
      url: job?.url ?? job?.jobUrl ?? '',
    },
    applicant: {
      lastName: applicant?.lastName ?? '',
      firstName: applicant?.firstName ?? '',
      lastNameKana: applicant?.lastNameKana ?? applicant?.pronunciationLastName,
      firstNameKana: applicant?.firstNameKana ?? applicant?.pronunciationFirstName,
      email: applicant?.email ?? '',
      phone: applicant?.phone ?? applicant?.phoneNumber,
      birthday: applicant?.birthday,
      gender: applicant?.gender,
      prefecture: applicant?.prefecture,
      city: applicant?.city,
      occupation: applicant?.occupation,
    },
    questionsAndAnswers: qaArray.map((qa: any) => ({
      question: qa?.question ?? '',
      answer: qa?.answer ?? '',
    })),
  }
}


