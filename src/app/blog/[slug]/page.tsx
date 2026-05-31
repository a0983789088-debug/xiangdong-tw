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
