import { createClient } from 'next-sanity'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3zcpri8u'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-01'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn: false ── 每次直接撈 Sanity API（不走 CDN 邊緣快取）
  // 換來：siteSettings 改動會立即生效（GSC 驗證、GA4 ID 等）
  // 代價：每個請求多 100-300ms（content 站可接受）
  useCdn: false,
})
