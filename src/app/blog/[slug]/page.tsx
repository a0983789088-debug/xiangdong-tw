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
} from '@/components/JsonLd'

export const revalidate = 300

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

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
            className="inline-block text-xs tracking-[3px] text-gold uppercase mb-3 hover:text-goldDark"
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
