import type { Metadata } from 'next'
import { groq } from 'next-sanity'

import { sanityClient } from '@/lib/sanity/client'
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard'

export const revalidate = 300

export const metadata: Metadata = {
  title: '香董文章',
  description: '香董把這十幾年買賣沉香、開料、品香的經驗用文字記下來。',
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
      <h1 className="font-serif text-3xl text-navy mb-6">香董文章</h1>
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
