import type { Metadata } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingCta } from '@/components/FloatingCta'
import { sanityClient } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerif = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'
  ),
  title: {
    default: '香董｜真正的天然好香',
    template: '%s ｜ 香董',
  },
  description:
    '推動沉香「標準化」與「價格透明化」。不只賣成品，連製香原材料都直接販售。真正能走得長久的品牌，建立在信任，不是神話。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '香董',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await sanityClient
    .fetch(SITE_SETTINGS_QUERY)
    .catch(() => null)

  return (
    <html lang="zh-TW" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <FloatingCta settings={settings} />
      </body>
    </html>
  )
}
