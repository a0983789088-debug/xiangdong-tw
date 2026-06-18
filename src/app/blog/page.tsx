import type { Metadata } from 'next'
import { groq } from 'next-sanity'

import { sanityClient } from '@/lib/sanity/client'
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard'

export const revalidate = 300

export const metadata: Metadata = {
  title: '香董文章｜沉香價格、真假辨識、線香推薦與佛珠知識',
  description:
    '香董文章整理沉香價格、真假辨識、沉香功效、天然線香推薦、線香使用、佛珠選購與新手避雷，用十幾年買賣與製香經驗講清楚。',
  alternates: { canonical: '/blog' },
}

type Category = {
  _id: string
  name: string
  slug: string
  description?: string
}

const ARTICLES_QUERY = groq`*[_type == "article" && defined(publishedAt)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  "category": category->{name, "slug": slug.current},
  publishedAt
}`

async function getArticles(): Promise<ArticleCardData[]> {
  try {
    const client: any = sanityClient
    const res = await client.fetch(ARTICLES_QUERY)
    return (res as ArticleCardData[]) || []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <main className="container-x py-10">
      <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
        Agarwood · Incense · Beads
      </p>
      <h1 className="font-serif text-3xl text-navy mb-3">
        沉香、線香與佛珠的實戰文章
      </h1>
      <p className="text-base text-woodLight max-w-2xl leading-relaxed mb-8">
        從沉香價格、真假辨識、天然線香推薦到沉香佛珠選擇，香董把十幾年買賣、開料與製香經驗整理成新手也看得懂的文章。
      </p>
      {articles.length === 0 ? (
        <p className="text-woodLight">文章準備中。</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      )}
    </main>
  )
}
