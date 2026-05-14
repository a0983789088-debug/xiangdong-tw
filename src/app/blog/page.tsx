import type { Metadata } from 'next'
import Link from 'next/link'
import { groq } from 'next-sanity'

import { sanityClient } from '@/lib/sanity/client'
import { ALL_CATEGORIES_QUERY } from '@/lib/sanity/queries'
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { estimateReadingMinutes } from '@/lib/readingTime'

export const revalidate = 300

export const metadata: Metadata = {
  title: '香董文章｜沉香知識 · 線香 · 佛珠文化',
  description:
    '香董把這十幾年買賣沉香、開料、品香的經驗用文字記下來。新手指南、真假辨識、產地差異、保存方法、收藏觀念，一篇一篇講清楚。',
  alternates: { canonical: '/blog' },
}

const LIST_QUERY = groq`*[_type == "article" && defined(publishedAt)
  && ($topic == "" || category->slug.current == $topic)
  && ($tag == "" || $tag in tags)
] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, coverImage,
  "category": category->{name, "slug": slug.current},
  publishedAt, body
}`

type Category = { _id: string; name: string; slug: string }

// Wrappers to bypass next-sanity v9 strict overload typing.
// Casting outside the component body avoids SWC parsing confusion.
async function fetchArticles(topic: string, tag: string): Promise<ArticleCardData[]> {
  try {
    const client = sanityClient as any
    const res = await client.fetch(LIST_QUERY, { topic, tag })
    return (res as ArticleCardData[]) || []
  } catch {
    return []
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const client = sanityClient as any
    const res = await client.fetch(ALL_CATEGORIES_QUERY)
    return (res as Category[]) || []
  } catch {
    return []
  }
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; tag?: string }>
}) {
  const sp = await searchParams
  const topic = sp.topic || ''
  const tag = sp.tag || ''

  const [articles, categories] = await Promise.all([
    fetchArticles(topic, tag),
    fetchCategories(),
  ])

  const activeCategory = categories.find((c) => c.slug === topic)
  let heading = '香董文章'
  if (activeCategory) heading = activeCategory.name
  else if (tag) heading = '#' + tag

  // Pre-build breadcrumb items to avoid inline conditional spreads inside JSX
  const breadcrumb: BreadcrumbItem[] = [
    { label: '首頁', href: '/' },
    { label: '文章', href: '/blog' },
  ]
  if (activeCategory) {
    breadcrumb.push({ label: activeCategory.name })
  } else if (tag) {
    breadcrumb.push({ label: '#' + tag })
  }

  const headerLabel = activeCategory ? 'Category' : tag ? 'Tag' : 'Articles'

  return (
    <>
      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={breadcrumb} />
      </div>

      <header className="container-x pt-4 pb-8">
        <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
          {headerLabel}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy mb-4">
          {heading}
        </h1>
        {activeCategory?.description && (
          <p className="text-base text-woodLight max-w-2xl leading-relaxed">
            {activeCategory.description}
          </p>
        )}
      </header>

      <div className="container-x pb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={
              'text-sm px-4 py-1.5 rounded-full border transition ' +
              (!topic && !tag
                ? 'bg-navy text-white border-navy'
                : 'border-gold/30 text-wood hover:border-gold')
            }
          >
            全部
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={'/blog?topic=' + c.slug}
              className={
                'text-sm px-4 py-1.5 rounded-full border transition ' +
                (topic === c.slug
                  ? 'bg-navy text-white border-navy'
                  : 'border-gold/30 text-wood hover:border-gold')
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <section className="container-x pb-20">
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard
                key={a._id}
                article={{
                  ...a,
                  readingMinutes: estimateReadingMinutes((a as any).body),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-cream border border-dashed border-gold/40 rounded-lg py-16 text-cent