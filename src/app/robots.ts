import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 一般搜尋引擎可全部爬
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api', '/_next'],
      },
      // 擋掉部分 AI 爬蟲，省 Vercel 流量（可後續再開放）
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Claude-Web', disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
