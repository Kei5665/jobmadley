import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { baseMetadata } from '@/lib/metadata'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
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
    <html lang="ja" className={inter.className}>
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//images.microcms-assets.io" />
        <link rel="dns-prefetch" href="//ridejob.jp" />
        
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Critical resource hints */}
        <link rel="preload" href="/images/logo-ridejob.png" as="image" type="image/png" />
        
        {/* Favicon */}
        <link rel="icon" href="/images/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        
        {/* Performance and Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
