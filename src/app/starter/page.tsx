import type { Metadata } from 'next'
import Image from 'next/image'
import { JsonLd, buildFaqJsonLd } from '@/components/JsonLd'
import { MetaPixelTrackedLink } from '@/components/MetaPixelTrackedLink'
import {
  StarterShopLink,
  StarterViewContent,
} from '@/components/StarterTracking'
import { CTA_PRESETS } from '@/lib/cta'
import { sanityClient } from '@/lib/sanity/client'
import { urlForImage } from '@/lib/sanity/image'
import { STARTER_PAGE_QUERY } from '@/lib/sanity/queries'

export const revalidate = 300

type StarterItem = {
  name: string
  sellingPoint: string
  originalPrice: number
}

type StarterFaq = {
  question: string
  answer: string
}

type StarterPageData = {
  headline: string
  subheadline: string
  heroImage?: {
    alt?: string
    asset?: { _ref?: string }
    hotspot?: unknown
    crop?: unknown
  }
  items: StarterItem[]
  bundlePrice: number
  originalTotal: number
  checkoutUrl: string
  trustStory: string[]
  communityMemberCount: number
  faq: StarterFaq[]
}

const FALLBACK_DATA: StarterPageData = {
  headline: '第一次點香，從這組開始',
  subheadline: '四種經典木質香韻，一次找到你喜歡的日常氣味。',
  items: [
    { name: '老山檀香線香', sellingPoint: '溫潤甜木調，日常最好入門。', originalPrice: 420 },
    { name: '降真香線香', sellingPoint: '清爽帶甜，空間氣味俐落。', originalPrice: 380 },
    { name: '肖楠線香', sellingPoint: '森林木質感，氣味穩定耐聞。', originalPrice: 320 },
    { name: '台灣黃檜線香', sellingPoint: '清新樹脂香，鮮明卻不刺鼻。', originalPrice: 360 },
  ],
  bundlePrice: 999,
  originalTotal: 1480,
  checkoutUrl: 'https://baujie-agarwood.my1shop.com/',
  trustStory: [
    '做這行十幾年，從擺攤、賣佛珠，一路到線香與原料。',
    '我不是大師，只堅持賣的東西要對得起客人。',
    '用了什麼料、比例怎麼配、價格怎麼來，都應該說得清楚。',
  ],
  communityMemberCount: 4886,
  faq: [
    { question: '運費怎麼算？', answer: '運費會依你在結帳頁選擇的配送方式顯示，下單前即可確認。' },
    { question: '收到後可以退貨嗎？', answer: '收到商品後享 7 天鑑賞期。商品需保持全新未使用並附發票，即可申請退貨；鑑賞期非試用期。' },
    { question: '多久會出貨？', answer: '現貨商品預計下單後 1–3 個工作天出貨；例假日或訂單量較大時會順延。' },
  ],
}

async function getStarterPage(): Promise<StarterPageData> {
  const page = await sanityClient
    .fetch<Partial<StarterPageData> | null>(STARTER_PAGE_QUERY)
    .catch(() => null)

  return {
    ...FALLBACK_DATA,
    ...page,
    items: page?.items?.length ? page.items : FALLBACK_DATA.items,
    trustStory: page?.trustStory?.length ? page.trustStory : FALLBACK_DATA.trustStory,
    faq: page?.faq?.length ? page.faq : FALLBACK_DATA.faq,
  }
}

const POLICY_SAFE_HEADLINE = FALLBACK_DATA.headline
const POLICY_SAFE_DESCRIPTION = FALLBACK_DATA.subheadline

function policySafe(value: string | undefined, fallback: string) {
  return value && !value.includes('沉香') ? value : fallback
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStarterPage()
  const title = policySafe(page.headline, POLICY_SAFE_HEADLINE)
  const description = policySafe(page.subheadline, POLICY_SAFE_DESCRIPTION)
  const heroImageUrl = page.heroImage
    ? urlForImage(page.heroImage as any)?.width(1200).height(630).fit('crop').url()
    : null

  return {
    title,
    description,
    alternates: { canonical: '/starter' },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName: '香董',
      title,
      description,
      url: 'https://xiangdong.tw/starter',
      images: heroImageUrl
        ? [{ url: heroImageUrl, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: heroImageUrl ? [heroImageUrl] : undefined,
    },
  }
}

const money = new Intl.NumberFormat('zh-TW')

export default async function StarterPage() {
  const page = await getStarterPage()
  const headline = policySafe(page.headline, POLICY_SAFE_HEADLINE)
  const heroImageUrl = page.heroImage
    ? urlForImage(page.heroImage as any)?.width(1200).height(1200).fit('crop').url()
    : null
  const savings = Math.max(0, page.originalTotal - page.bundlePrice)

  return (
    <div className="starter-page-root overflow-hidden bg-[#f8f4ed]">
      <StarterViewContent value={page.bundlePrice} />
      <JsonLd data={buildFaqJsonLd(page.faq)} />

      <header className="bg-navy px-5 py-3 text-center text-sm tracking-[0.18em] text-cream">
        香董 XIANGDONG・入門選香
      </header>

      <main>
        <section className="bg-cream">
          <div className="mx-auto grid max-w-5xl md:grid-cols-2 md:items-stretch">
            <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,#d8c49a_0%,#6d5539_46%,#172b42_100%)] md:order-2 md:aspect-auto md:min-h-[38rem]">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={page.heroImage?.alt || '入門香組合'}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-48 w-20 rounded-full border border-cream/35 bg-cream/10 shadow-2xl shadow-black/30" />
                  <div className="absolute h-px w-40 rotate-12 bg-gold/50" />
                  <p className="absolute bottom-6 text-xs tracking-[0.28em] text-cream/70">
                    主視覺可於後台更換
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/25 to-transparent" />
            </div>

            <div className="flex flex-col justify-center px-5 py-10 sm:px-10 md:order-1 md:py-16">
              <p className="mb-3 text-xs font-medium tracking-[0.24em] text-goldDark">
                一盒認識四種經典香韻
              </p>
              <h1 className="text-[2rem] leading-[1.28] text-navy sm:text-4xl">
                {headline}
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-woodLight">
                {page.subheadline}
              </p>

              <div className="mt-8 flex items-end gap-3">
                <p className="text-sm text-woodLight">組合價</p>
                <p className="font-serif text-4xl leading-none text-navy">
                  <span className="mr-1 text-lg">NT$</span>
                  {money.format(page.bundlePrice)}
                </p>
              </div>
              <p className="mt-2 text-sm text-woodLight">
                原價 <span className="line-through">NT${money.format(page.originalTotal)}</span>
                {savings > 0 && (
                  <span className="ml-2 font-medium text-[#9b3e2f]">
                    現省 NT${money.format(savings)}
                  </span>
                )}
              </p>

              <StarterShopLink
                checkoutUrl={page.checkoutUrl}
                value={page.bundlePrice}
                placement="primary"
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-[#a43d2f] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-[#a43d2f]/20 transition hover:bg-[#873126] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
              >
                立即下單
              </StarterShopLink>
              <p className="mt-3 text-center text-xs text-woodLight">
                點擊後前往 1shop 安全結帳
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-center text-xs tracking-[0.24em] text-goldDark">
              STARTER SELECTION
            </p>
            <h2 className="mt-3 text-center text-2xl sm:text-3xl">
              這一盒，你會收到
            </h2>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm">
              {page.items.map((item, index) => (
                <div
                  key={item.name + index}
                  className="grid grid-cols-[2rem_1fr_auto] gap-3 border-b border-gold/15 px-4 py-5 last:border-b-0 sm:px-6"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs text-cream">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base leading-snug">{item.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-woodLight">
                      {item.sellingPoint}
                    </p>
                  </div>
                  <p className="pt-1 text-sm tabular-nums text-wood">
                    NT${money.format(item.originalPrice)}
                  </p>
                </div>
              ))}
              <div className="bg-cream px-5 py-6 sm:px-7">
                <div className="flex items-center justify-between text-sm text-woodLight">
                  <span>單品原價合計</span>
                  <span className="line-through">NT${money.format(page.originalTotal)}</span>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <span className="font-medium text-navy">入門組合價</span>
                  <span className="font-serif text-3xl text-[#a43d2f]">
                    NT${money.format(page.bundlePrice)}
                  </span>
                </div>
                {savings > 0 && (
                  <p className="mt-2 text-right text-sm font-medium text-[#9b3e2f]">
                    比單買省下 NT${money.format(savings)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-navy px-5 py-14 text-cream sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs tracking-[0.24em] text-gold">WHY XIANGDONG</p>
            <h2 className="mt-3 text-2xl text-cream sm:text-3xl">
              不靠玄學，讓每一份選擇都有理由
            </h2>
            <div className="mt-7 space-y-3 border-l border-gold/60 pl-5">
              {page.trustStory.slice(0, 3).map((line) => (
                <p key={line} className="leading-relaxed text-cream/85">
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-8 inline-flex items-baseline gap-2 rounded-full border border-gold/40 px-5 py-2.5">
              <strong className="font-serif text-2xl text-gold">
                {money.format(page.communityMemberCount)}+
              </strong>
              <span className="text-sm text-cream/80">位社團香友一起交流</span>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs tracking-[0.24em] text-goldDark">FAQ</p>
            <h2 className="mt-3 text-2xl sm:text-3xl">下單前，你可能想問</h2>
            <div className="mt-7 divide-y divide-gold/20 border-y border-gold/20">
              {page.faq.map((item, index) => (
                <details key={item.question + index} className="group py-1">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-4 text-left font-medium text-navy">
                    <span className="flex-1">{item.question}</span>
                    <span className="text-xl text-gold transition-transform group-open:rotate-45">＋</span>
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-woodLight">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl sm:text-3xl">準備好認識自己的日常香氣了嗎？</h2>
            <p className="mt-3 text-sm leading-relaxed text-woodLight">
              一盒四種香韻，慢慢聞、慢慢選，從你真正喜歡的開始。
            </p>
            <StarterShopLink
              checkoutUrl={page.checkoutUrl}
              value={page.bundlePrice}
              placement="secondary"
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-[#a43d2f] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-[#a43d2f]/20 transition hover:bg-[#873126] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
            >
              立即下單
            </StarterShopLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-gold/20 bg-white px-5 py-8 text-center">
        <MetaPixelTrackedLink
          href={CTA_PRESETS.line.url}
          target="_blank"
          rel="noopener"
          eventName="Lead"
          googleAdsConversion="lineLead"
          className="inline-flex min-h-12 items-center justify-center text-sm font-medium text-navy underline decoration-gold underline-offset-4"
        >
          還沒決定？加 LINE 先領《沉香新手避雷指南》
        </MetaPixelTrackedLink>
      </footer>
    </div>
  )
}
