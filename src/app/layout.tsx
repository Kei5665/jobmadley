import type { Metadata, Viewport } from 'next'
import { Inter, Zen_Maru_Gothic, Zen_Kaku_Gothic_New, Archivo_Black } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { baseMetadata } from '@/shared/lib/metadata'
import UTMCapture from '@/features/application/components/utm-capture'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  display: 'swap',
  variable: '--font-display',
})

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  display: 'swap',
  variable: '--font-body',
})

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-eng',
})

export const metadata: Metadata = baseMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.className} ${zenMaruGothic.variable} ${zenKakuGothicNew.variable} ${archivoBlack.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5CQGTMXF');",
          }}
        />
        {/* End Google Tag Manager */}

        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//images.microcms-assets.io" />
        <link rel="dns-prefetch" href="//ridejob.jp" />

        {/* Critical resource hints */}
        <link rel="preload" href="/images/logo-ridejob.png" as="image" type="image/png" />
        
        {/* Favicon */}
        <link rel="icon" href="/images/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        
        {/* Disable browser auto-dark-mode (light theme only) */}
        <meta name="color-scheme" content="only light" />

        {/* Performance and Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5CQGTMXF"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {/* UTMパラメーターキャプチャ */}
        <Suspense fallback={null}>
          <UTMCapture />
        </Suspense>
        
        {children}
      </body>
    </html>
  )
}
