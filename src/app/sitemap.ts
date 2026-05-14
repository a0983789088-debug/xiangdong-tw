import type { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity/client'
import { ALL_ARTICLE_SLUGS_QUERY } from '@/lib/sanity/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

export const revalidate = 3600 // 每小時重生

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/line`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const articles = await sanityClient
    .fetch<Array<{ slug: string; publishedAt: string; _updatedAt: string }>>(
      ALL_ARTICLE_SLUGS_QUERY
    )
    .catch(() => [])

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(a._updatedAt || a.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...articlePages]
}
