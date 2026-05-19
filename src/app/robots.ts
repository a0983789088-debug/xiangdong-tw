import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 一般搜尋引擎可全部爬
      // 注意：不能擋整個 /_next，會讓 Googlebot 抓不到 CSS/JS 渲染樣式。
      // 只擋 /_next/data/（SSR data layer），保留 /_next/static/ 給 Google。
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api', '/_next/data/'],
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
