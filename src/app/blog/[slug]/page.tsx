import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { sanityClient } from '@/lib/sanity/client'
import {
  ARTICLE_BY_SLUG_QUERY,
  ALL_ARTICLE_SLUGS_QUERY,
  FALLBACK_RELATED_ARTICLES_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/lib/sanity/queries'
import { urlForImage } from '@/lib/sanity/image'
import { estimateReadingMinutes } from '@/lib/readingTime'

import { Breadcrumb } from '@/components/Breadcrumb'
import { PortableTextContent, extractToc } from '@/components/PortableTextContent'
import { TableOfContents } from '@/components/TableOfContents'
import { FaqSection } from '@/components/FaqSection'
import { ArticleCta } from '@/components/ArticleCta'
import { RelatedArticles } from '@/components/RelatedArticles'
import { RelatedProducts } from '@/components/RelatedProducts'
import {
  JsonLd,
  buildArticleJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
  buildHowToJsonLd,
} from '@/components/JsonLd'

export const revalidate = 300

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

type SeoSalesGuide = {
  answer: {
    eyebrow: string
    title: string
    body: string
  }
  mistakes: string[]
  method: Array<{
    title: string
    body: string
  }>
  audience: string[]
  routes: Array<{
    title: string
    body: string
    href: string
    label: string
    external?: boolean
    primary?: boolean
  }>
}

/**
 * HowTo 結構化資料 ── 給 Google / AI 看的「步驟教學」標記
 * 只有明確有步驟的教學文才會啟用、其他文章維持原狀。
 */
const HOWTO_BY_SLUG: Record<
  string,
  {
    name: string
    description: string
    totalTime?: string
    steps: Array<{ name: string; text: string }>
  }
> = {
  'how-to-light-and-extinguish-incense': {
    name: '怎麼正確點香與滅香（晃香法）',
    description:
      '用打火機內焰點燃香頭、再用「先往後、再往前」的晃香法滅火、可以保留完整的頭香層次、避免高溫碳化或嘴吹造成的雜味。',
    totalTime: 'PT2M',
    steps: [
      {
        name: '用打火機內焰點燃香頭',
        text: '把打火機火焰調小一點、用靠近本體的藍色內焰部分接觸香頭、避免外焰高溫快速碳化表面、燒糊頭香層次。',
      },
      {
        name: '手持香身、線香拿穩',
        text: '香品點燃後不要急著放下、手持香身末端、讓線香維持垂直、不要傾斜、避免香灰整段掉落。',
      },
      {
        name: '稍微往後帶一下',
        text: '把香頭朝身體略後方輕輕一帶、動作要慢、不要太用力、這一帶是為了在下一個動作前讓火苗集中。',
      },
      {
        name: '快速往前斜向一晃',
        text: '接著快速往斜前方一晃、利用空氣自然流動把火苗順手帶熄。動作乾淨俐落、不需要重複甩動。',
      },
    ],
  },
  'agarwood-real-vs-fake': {
    name: '怎麼分辨沉香真假 ── 香董的 5 招避雷心法',
    description:
      '不靠拿打火機燒、用「一摸、二聞、三帶、四感、問來源」5 個步驟、從油脂、香氣、重量、觸感與產地來源全面判斷沉香真假。',
    totalTime: 'PT5M',
    steps: [
      {
        name: '一摸 ── 摸油脂感',
        text: '手指摸過沉香表面、感受油脂分布是否自然。真沉香油脂結在木質紋理裡、摸起來有溫潤的油感；假沉香或泡油料表面通常油得不自然、甚至會沾手。',
      },
      {
        name: '二聞 ── 聞香韻層次',
        text: '常溫狀態下輕聞、再用體溫或手心搓熱聞。真沉香的香氣有前中後段層次（甜、涼、木質尾韻）；化學催香或人工料聞起來香氣單薄、且久聞會頭暈或刺鼻。',
      },
      {
        name: '三帶 ── 看重量是否合理',
        text: '同樣大小的沉香、油脂含量越高、重量越沉。手上掂掂看、如果體積大但輕得不合理、可能是油脂不足或被掏空的次料；過重又均勻可能是泡油增重。',
      },
      {
        name: '四感 ── 摸質感與紋理',
        text: '看表面紋理走向是否自然、有沒有刀痕或人工拼接痕跡。真沉香的紋路會跟著樹的生長方向走、油脂分布有深淺；人工料紋理通常太工整或太雜亂。',
      },
      {
        name: '問來源 ── 確認產地與管道',
        text: '直接問賣家「這支料從哪裡來？」可信賣家會明確回答產區（越南、印尼、芽莊⋯⋯）；只說「上等老料」或「大師收藏」這類含糊用詞的、要小心。',
      },
    ],
  },
}

const SEO_SALES_GUIDE_BY_SLUG: Record<string, SeoSalesGuide> = {
  'agarwood-sinking-water-value': {
    answer: {
      eyebrow: '先講結論',
      title: '沉香會沉水，不代表一定比較貴。',
      body:
        '沉水只能說明密度與油脂條件達到某個程度。真正要判斷價值，還要一起看油脂分布、結香狀態、香韻表現、產區特徵與這塊料適合拿來做什麼。',
    },
    mistakes: [
      '會沉水就是頂級',
      '不沉水就是假貨',
      '越黑就一定越貴',
      '價格高就一定香',
      '老闆說稀有就不敢問',
    ],
    method: [
      {
        title: '先看油脂分布',
        body: '油脂是局部、線狀、片狀，還是整塊自然滲進木質裡，會影響香韻與價格。',
      },
      {
        title: '再看結香狀態',
        body: '結香方式會決定料子的層次。只看沉水，容易忽略它到底是自然成香還是後天處理。',
      },
      {
        title: '一定要聞香韻',
        body: '真正在使用時，決定你喜不喜歡的是香韻，不是一杯水裡沉下去的速度。',
      },
      {
        title: '最後才看用途',
        body: '日常點香、送禮、收藏玩料，該看的重點不同，預算也不該用同一套標準。',
      },
    ],
    audience: [
      '第一次買沉香的人',
      '被沉水說法搞混的人',
      '想送禮但怕買錯的人',
      '已經買過幾次，想開始看懂價格的人',
    ],
    routes: [
      {
        title: '不確定怎麼選',
        body: '先把預算、用途、喜歡的香韻告訴香董，少走冤枉路。',
        href: '/line',
        label: '加 LINE 問香董',
        primary: true,
      },
      {
        title: '想看固定現貨',
        body: '日常線香、試香組與固定品項，先從商城看目前有什麼。',
        href: '/shop',
        label: '看商城現貨',
      },
      {
        title: '想看特殊料',
        body: '少量料、收藏級、直播競標品，通常會在社團裡流動。',
        href: 'https://www.facebook.com/groups/1789214647984397',
        label: '加入 FB 競標社團',
        external: true,
      },
    ],
  },
}

/** SSG: 預先生成所有文章靜態頁 */
export async function generateStaticParams() {
  const slugs = await sanityClient
    .fetch<Array<{ slug: string }>>(ALL_ARTICLE_SLUGS_QUERY)
    .catch(() => [])
  return slugs.map((s) => ({ slug: s.slug }))
}

/** SEO Metadata（每篇文章一份） */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await (sanityClient as any)
    .fetch(ARTICLE_BY_SLUG_QUERY, { slug })
    .catch(() => null)

  if (!article) {
    return { title: '找不到文章' }
  }

  const url = `${SITE_URL}/blog/${slug}`
  const title = article.seoTitle || article.title
  const description = article.seoDescription || article.excerpt || undefined
  const ogImage =
    article.ogImage || article.coverImage
      ? urlForImage(article.ogImage || article.coverImage)
          ?.width(1200)
          .height(630)
          .url() || undefined
      : undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: '香董',
      publishedTime: article.publishedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [article, settings] = await Promise.all([
    (sanityClient as any).fetch(ARTICLE_BY_SLUG_QUERY, { slug }).catch(() => null),
    (sanityClient as any).fetch(SITE_SETTINGS_QUERY).catch(() => null),
  ])

  if (!article) notFound()

  // 相關文章：手動指定優先，否則 fallback 同分類
  let related = article.manualRelatedArticles || []
  if (related.length === 0 && article.category?._id) {
    related = await (sanityClient as any)
      .fetch(FALLBACK_RELATED_ARTICLES_QUERY, {
        currentId: article._id,
        categoryId: article.category._id,
      })
      .catch(() => [])
  }

  const readingMinutes = estimateReadingMinutes(article.body)
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '.')
    : ''

  const coverUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(1600).url()
    : null
  const ogImageUrl = article.ogImage || article.coverImage
    ? urlForImage(article.ogImage || article.coverImage)
        ?.width(1200)
        .height(630)
        .url()
    : undefined

  const toc = extractToc(article.body)
  const url = `${SITE_URL}/blog/${slug}`
  const seoSalesGuide = SEO_SALES_GUIDE_BY_SLUG[slug]

  // 麵包屑
  const breadcrumb = [
    { label: '首頁', href: '/' },
    { label: '文章', href: '/blog' },
    ...(article.category
      ? [
          {
            label: article.category.name,
            href: `/blog?topic=${article.category.slug}`,
          },
        ]
      : []),
    { label: article.title },
  ]

  return (
    <article>
      {/* === JSON-LD：給 Google 看的結構化資料 === */}
      <JsonLd
        data={buildArticleJsonLd({
          title: article.title,
          description: article.excerpt,
          url,
          imageUrl: ogImageUrl,
          publishedAt: article.publishedAt,
          category: article.category?.name,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumb
            .filter((b) => b.href)
            .map((b) => ({ label: b.label, url: `${SITE_URL}${b.href}` }))
            .concat([{ label: article.title, url }])
        )}
      />
      {HOWTO_BY_SLUG[slug] && (
        <JsonLd
          data={buildHowToJsonLd({
            ...HOWTO_BY_SLUG[slug],
            imageUrl: ogImageUrl,
          })}
        />
      )}
      {article.faq?.length > 0 && (
        <JsonLd data={buildFaqJsonLd(article.faq)} />
      )}

      {/* === Breadcrumb === */}
      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={breadcrumb} />
      </div>

      {/* === Article Header === */}
      <header className="container-x pt-4 pb-6 max-w-3xl">
        {article.category && (
          <Link
            href={`/blog?topic=${article.category.slug}`}
            className="inline-block text-xs tracking-[3px] text-goldDark uppercase mb-3 hover:text-goldDark"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="font-serif text-3xl md:text-4xl text-navy leading-tight mb-4">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-base text-woodLight leading-relaxed mb-5">
            {article.excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-woodLight border-t border-gold/20 pt-4">
          <span>香董</span>
          {date && (
            <>
              <span className="text-gold/50">·</span>
              <time dateTime={article.publishedAt}>{date}</time>
            </>
          )}
          <span className="text-gold/50">·</span>
          <span>閱讀時間 {readingMinutes} 分鐘</span>
        </div>
      </header>

      {/* === Cover Image === */}
      {coverUrl && (
        <div className="container-x pb-8">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-cream">
            <Image
              src={coverUrl}
              alt={article.coverImage?.alt || article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {seoSalesGuide && <SeoSalesGuideBlock guide={seoSalesGuide} />}

      {/* === Body + TOC === */}
      <div className="container-x pb-10">
        <div className="grid lg:grid-cols-[1fr,minmax(0,720px),1fr] gap-8">
          <aside className="hidden lg:block" />
          <div>
            <PortableTextContent value={article.body} />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gold/20">
                <p className="text-xs text-woodLight mb-2">標籤</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="text-xs px-3 py-1 rounded-full bg-cream text-navy hover:bg-gold/20 transition"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {article.faq?.length > 0 && <FaqSection items={article.faq} />}

            {/* CTA */}
            <ArticleCta
              ctaOverride={article.ctaOverride}
              siteCtas={settings?.ctas}
            />

            {/* Related Products */}
            {article.relatedProducts?.length > 0 && (
              <RelatedProducts products={article.relatedProducts} />
            )}

            {/* Related Articles */}
            {related.length > 0 && <RelatedArticles articles={related} />}
          </div>

          {/* Right: TOC (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}

function SeoSalesGuideBlock({ guide }: { guide: SeoSalesGuide }) {
  return (
    <section className="mb-10 border-y border-gold/15 bg-cream py-10 md:py-12">
      <div className="container-x">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs tracking-[3px] text-goldDark uppercase">
                {guide.answer.eyebrow}
              </p>
              <h2 className="mb-4 font-serif text-2xl leading-snug text-navy md:text-3xl">
                {guide.answer.title}
              </h2>
              <p className="text-base leading-relaxed text-woodLight">
                {guide.answer.body}
              </p>
            </div>

            <div className="rounded-lg border border-gold/20 bg-white p-4 md:p-5">
              <p className="mb-3 text-sm font-medium text-navy">
                新手最常踩的坑
              </p>
              <ul className="space-y-2.5">
                {guide.mistakes.map((mistake) => (
                  <li
                    key={mistake}
                    className="flex gap-2 text-sm leading-snug text-woodLight"
                  >
                    <span className="mt-0.5 text-goldDark">×</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gold/20 pt-7">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs tracking-[3px] text-goldDark uppercase">
                  香董判斷法
                </p>
                <h3 className="font-serif text-xl text-navy">
                  不只看沉不沉水，我會照這幾步判斷。
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-woodLight">
                先把判斷順序抓對，價格才有討論基礎。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {guide.method.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-lg border border-gold/20 bg-white p-4"
                >
                  <p className="mb-3 text-xs text-goldDark">
                    0{index + 1}
                  </p>
                  <h4 className="mb-2 text-base text-navy">
                    {step.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-woodLight">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-5 border-t border-gold/20 pt-7 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="mb-2 text-xs tracking-[3px] text-goldDark uppercase">
                這篇適合誰
              </p>
              <div className="flex flex-wrap gap-2">
                {guide.audience.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gold/20 bg-white px-3 py-1.5 text-xs text-navy"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {guide.routes.map((route) => {
                const className = route.primary
                  ? 'group flex min-h-36 flex-col justify-between rounded-lg bg-navy p-4 text-cream transition hover:bg-navyDark'
                  : 'group flex min-h-36 flex-col justify-between rounded-lg border border-gold/20 bg-white p-4 text-navy transition-colors hover:border-gold/60'
                const bodyClass = route.primary
                  ? 'text-sm leading-relaxed text-cream/78'
                  : 'text-sm leading-relaxed text-woodLight'
                const labelClass = route.primary
                  ? 'mt-4 text-sm text-gold'
                  : 'mt-4 text-sm text-goldDark group-hover:text-navy'
                const headingClass = route.primary
                  ? 'mb-2 text-base text-cream'
                  : 'mb-2 text-base text-navy'
                const content = (
                  <>
                    <div>
                      <h4 className={headingClass}>{route.title}</h4>
                      <p className={bodyClass}>{route.body}</p>
                    </div>
                    <span className={labelClass}>{route.label} →</span>
                  </>
                )

                return route.external ? (
                  <a
                    key={route.href}
                    href={route.href}
                    target="_blank"
                    rel="noopener"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={route.href} href={route.href} className={className}>
                    {content}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
