import type { Metadata } from 'next'
import Script from 'next/script'
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

const DEFAULT_TITLE = '香董｜真正的天然好香 · 沉香 · 線香 · 佛珠'
const DEFAULT_DESCRIPTION =
  '香董，台灣沉香買賣商，做這行十幾年。沉香真假辨識、產地差別、保存方法、線香怎麼挑、佛珠選擇 ── 用實戰經驗一篇篇講清楚。不靠故事、不靠大師，靠看得見的原料。'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityClient
    .fetch<any>(SITE_SETTINGS_QUERY)
    .catch(() => null)

  const title = settings?.siteTitle || DEFAULT_TITLE
  const description = settings?.siteDescription || DEFAULT_DESCRIPTION
  const gscCode = settings?.searchConsoleVerification

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'
    ),
    title: { default: title, template: '%s ｜ 香董' },
    description,
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName: '香董',
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
    verification: gscCode ? { google: gscCode } : undefined,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await sanityClient
    .fetch<any>(SITE_SETTINGS_QUERY)
    .catch(() => null)

  const gaId = settings?.gaId

  return (
    <html lang="zh-TW" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        {/* GA4 ── 只在 Sanity 後台填了 gaId 才注入 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}

        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <FloatingCta settings={settings} />
      </body>
    </html>
  )
}
