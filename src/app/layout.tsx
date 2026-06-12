import type { Metadata } from 'next'
import Script from 'next/script'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingCta } from '@/components/FloatingCta'
import { sanityClient } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { urlForImage } from '@/lib/sanity/image'
import { JsonLd } from '@/components/JsonLd'

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerif = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
})

const DEFAULT_TITLE = '香董｜真正的天然好香 · 沉香 · 線香 · 佛珠'
const DEFAULT_DESCRIPTION =
  '香董，台灣沉香買賣商，做這行十幾年。沉香真假辨識、產地差別、保存方法、線香怎麼挑、佛珠選擇 ── 用實戰經驗一篇篇講清楚。不靠故事、不靠大師，靠看得見的原料。'
const CLARITY_PROJECT_ID = 'x5x1pa18i4'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityClient.fetch<any>(SITE_SETTINGS_QUERY).catch(() => null)

  // VERCEL_ENV = 'production' | 'preview' | 'development'
  // 只有正式網域才讓 Google 索引；preview / dev 一律 noindex
  const isProductionHost = process.env.VERCEL_ENV === 'production'

  const title = settings?.siteTitle || DEFAULT_TITLE
  const description = settings?.siteDescription || DEFAULT_DESCRIPTION
  const gscCode = settings?.searchConsoleVerification

  // og:image: 優先用 defaultOgImage、沒有就用 founderPhoto
  const ogSource = settings?.defaultOgImage || settings?.founderPhoto
  const ogImageUrl = ogSource
    ? urlForImage(ogSource)?.width(1200).height(630).fit('crop').url()
    : null

  return {
    metadataBase: new URL('https://xiangdong.tw'),
    title: { default: title, template: '%s ｜ 香董' },
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName: '香董',
      title,
      description,
      url: 'https://xiangdong.tw',
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    robots: {
      index: isProductionHost,
      follow: isProductionHost,
    },
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

  const shouldLoadClarity = process.env.VERCEL_ENV === 'production'

  return (
    <html lang="zh-TW" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: '香董',
            alternateName: 'Xiangdong',
            url: 'https://xiangdong.tw',
            description:
              '香董，台灣沉香買賣商，推動沉香標準化與價格透明化。不只賣成品，連製香原材料都直接販售。',
            sameAs: [
              'https://lin.ee/89W39yX',
              'https://line.me/ti/g2/uuQhXp6AQHZxdg_uwDQqcUrCIP5c-i3fBzfh1A',
              'https://www.facebook.com/groups/1789214647984397',
              'https://www.facebook.com/groups/260642251054970',
              'https://www.instagram.com/baujie_agarwood/',
              'https://www.tiktok.com/@baojieagarwood',
              'https://jambolive.tv/shop/62349/product/fb/',
            ],
          }}
        />
        {shouldLoadClarity && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}

        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <FloatingCta settings={settings} />
      </body>
    </html>
  )
}
