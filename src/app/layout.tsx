import type { Metadata } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingCta } from '@/components/FloatingCta'
import { MetaPixelPageView } from '@/components/MetaPixelPageView'
import { sanityClient } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { urlForImage } from '@/lib/sanity/image'
import { JsonLd } from '@/components/JsonLd'
import { META_PIXEL_ID } from '@/lib/metaPixel'
import { GOOGLE_ADS_CONVERSION_ID } from '@/lib/googleAds'

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

const LEGACY_SITE_TITLE = '香董｜真正的天然好香 · 沉香 · 線香 · 佛珠'
const DEFAULT_TITLE = '香董｜天然沉香、天然線香與佛珠｜真正的天然好香'
const DEFAULT_DESCRIPTION =
  '香董，台灣沉香買賣商，做這行十幾年。沉香真假辨識、沉香價格、產地差別、天然線香推薦、佛珠選擇，用實戰經驗一篇篇講清楚。'
const CLARITY_PROJECT_ID = 'x5x1pa18i4'
const GA_MEASUREMENT_ID = 'G-6LDJXZ6EH5'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityClient.fetch<any>(SITE_SETTINGS_QUERY).catch(() => null)

  // VERCEL_ENV = 'production' | 'preview' | 'development'
  // 只有正式網域才讓 Google 索引；preview / dev 一律 noindex
  const isProductionHost = process.env.VERCEL_ENV === 'production'

  const title =
    !settings?.siteTitle || settings.siteTitle === LEGACY_SITE_TITLE
      ? DEFAULT_TITLE
      : settings.siteTitle
  const description =
    !settings?.siteDescription || settings.siteTitle === LEGACY_SITE_TITLE
      ? DEFAULT_DESCRIPTION
      : settings.siteDescription
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

  const shouldLoadAnalytics = process.env.VERCEL_ENV === 'production'

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
              'https://baujie-agarwood.my1shop.com/',
            ],
          }}
        />
        {shouldLoadAnalytics && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
                ${
                  GOOGLE_ADS_CONVERSION_ID
                    ? `gtag('config', '${GOOGLE_ADS_CONVERSION_ID}');`
                    : ''
                }
              `}
            </Script>
            <Script id="microsoft-clarity" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
              `}
            </Script>
          </>
        )}
        {shouldLoadAnalytics && (
          <>
            <Script id="meta-pixel-init" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
            <Suspense fallback={null}>
              <MetaPixelPageView />
            </Suspense>
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
