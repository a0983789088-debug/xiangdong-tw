import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 一般搜尋引擎可全部爬
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
