import type { Metadata } from 'next'
import './globals.css'
import { StagewiseToolbar } from "@stagewise/toolbar-next"
import ReactPlugin from "@stagewise-plugins/react"

export const metadata: Metadata = {
  title: 'ライドジョブ | タクシー運転手の求人・転職サイト',
  description:
    'タクシー運転手専門の求人・転職情報を掲載する「ライドジョブ」。全国の最新求人をスピード検索。応募もオンラインで簡単！',
  openGraph: {
    title: 'ライドジョブ | タクシー運転手の求人・転職サイト',
    description:
      'タクシー運転手専門の求人・転職情報を掲載する「ライドジョブ」。全国の最新求人をスピード検索。応募もオンラインで簡単！',
    url: 'https://ridejob-cms.online/ssw/ja',
    siteName: 'ライドジョブ',
    images: [
      {
        url: '/OGP.png',
        width: 1200,
        height: 630,
        alt: 'ライドジョブ',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ライドジョブ | タクシー運転手の求人・転職サイト',
    description:
      'タクシー運転手専門の求人・転職情報を掲載する「ライドジョブ」。全国の最新求人をスピード検索。応募もオンラインで簡単！',
    images: ['/OGP.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && (
          <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
        )}
      </body>
    </html>
  )
}
