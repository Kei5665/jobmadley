import type { Metadata } from 'next'
import type { JobDetail, Job } from './types'

// =====================
// メタデータ設定
// =====================

const SITE_NAME = 'RIDE JOB'
const SITE_DESCRIPTION = 'ドライバー・運転職の求人情報サイト。タクシー運転手、配送ドライバー、介護ドライバーなど、あなたにぴったりの運転職求人を見つけよう。'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ridejob.jp'
const OGP_IMAGE = '/images/OGP.png'

/**
 * 基本のメタデータ
 */
export const baseMetadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'タクシー運転手',
    '配送ドライバー',
    '介護ドライバー',
    'ドライバー求人',
    '運転職',
    '転職',
    '求人',
    'RIDE JOB',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OGP_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OGP_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/**
 * トップページのメタデータ
 */
export const generateHomeMetadata = (): Metadata => ({
  title: `${SITE_NAME} - ドライバー・運転職の求人情報`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} - ドライバー・運転職の求人情報`,
    description: SITE_DESCRIPTION,
    url: '/',
    images: [OGP_IMAGE],
  },
})

/**
 * 検索結果ページのメタデータ
 */
export const generateSearchMetadata = (params: {
  prefectureName?: string
  municipalityName?: string
  jobCategoryName?: string
  totalCount?: number
}): Metadata => {
  const { prefectureName, municipalityName, jobCategoryName, totalCount } = params
  
  const locationText = municipalityName 
    ? `${municipalityName}（${prefectureName}）`
    : prefectureName || '全国'
  
  const jobText = jobCategoryName || 'ドライバー・運転職'
  const title = `${locationText}の${jobText}求人一覧`
  const description = `${locationText}の${jobText}求人情報。${totalCount ? `${totalCount}件の求人` : '多数の求人'}を掲載中。あなたにぴったりの求人を見つけよう。`
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OGP_IMAGE],
    },
    alternates: {
      canonical: '/search',
    },
  }
}

/**
 * 求人詳細ページのメタデータ
 */
export const generateJobMetadata = (job: JobDetail): Metadata => {
  const title = `${job.jobName ?? job.title} - ${job.companyName ?? '企業名非公開'}`
  const locationText = job.municipality?.name 
    ? `${job.municipality.name}（${job.prefecture?.region}）`
    : job.prefecture?.region || '勤務地未定'
  
  const salaryText = job.salaryMin && job.salaryMax
    ? `月給${job.salaryMin.toLocaleString()}円～${job.salaryMax.toLocaleString()}円`
    : job.salaryMin
    ? `月給${job.salaryMin.toLocaleString()}円〜`
    : '給与応相談'
  
  const description = `${locationText}の${job.jobCategory?.name || 'ドライバー'}求人。${salaryText}。${job.descriptionAppeal || job.descriptionWork || '詳細情報をご確認ください。'}`
  
  const imageUrl = job.images?.[0]?.url || job.imageUrl || OGP_IMAGE
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: {
      canonical: `/job/${job.id}`,
    },
  }
}

/**
 * 応募ページのメタデータ
 */
export const generateApplyMetadata = (job: JobDetail): Metadata => {
  const title = `応募フォーム - ${job.jobName ?? job.title}`
  const description = `${job.companyName ?? '企業'} の${job.jobName ?? job.title}への応募フォームです。`
  
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/apply/${job.id}`,
    },
  }
}

/**
 * 構造化データの生成
 */
export const generateJobPostingStructuredData = (job: JobDetail) => {
  const baseUrl = SITE_URL
  
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.jobName ?? job.title,
    description: job.descriptionWork ?? job.descriptionAppeal ?? job.title,
    identifier: {
      '@type': 'PropertyValue',
      name: job.companyName ?? SITE_NAME,
      value: job.id,
    },
    datePosted: job.publishedAt ?? job.createdAt,
    validThrough: job.updatedAt,
    employmentType: job.employmentType ? [job.employmentType] : ['FULL_TIME'],
    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName ?? '企業名非公開',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: job.prefecture?.region,
        addressLocality: job.municipality?.name,
        postalCode: job.addressZip,
        streetAddress: job.addressLine,
      },
    },
    baseSalary: job.salaryMin ? {
      '@type': 'MonetaryAmount',
      currency: 'JPY',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax ?? job.salaryMin,
        unitText: 'MONTH',
      },
    } : undefined,
    url: `${baseUrl}/job/${job.id}`,
    applicationInstructions: `${baseUrl}/apply/${job.id} からご応募ください。`,
  }
}

/**
 * パンくずリストの構造化データ
 */
export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url?: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  }
} 