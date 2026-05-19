import type { Metadata } from 'next'
import { sanityClient } from './sanity/client'
import { SITE_SETTINGS_QUERY } from './sanity/queries'
import { urlForImage } from './sanity/image'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

type BuildPageMetadataOpts = {
  title: string
  description: string
  path: string
}

/**
 * 給「website」型靜態頁面用的 metadata builder。
 * 解決 Next.js openGraph 不深合併、子頁不寫 openGraph 就會繼承 layout 首頁卡片的 bug。
 * /blog/[slug] 是 article 型，有自己的 generateMetadata，不走這個。
 */
export async function buildPageMetadata({
  title,
  description,
  path,
}: BuildPageMetadataOpts): Promise<Metadata> {
  const settings = await sanityClient
    .fetch<any>(SITE_SETTINGS_QUERY)
    .catch(() => null)

  const ogSource = settings?.defaultOgImage || settings?.founderPhoto
  const ogImageUrl = ogSource
    ? urlForImage(ogSource)?.width(1200).height(630).fit('crop').url()
    : null

  const url = `${SITE_URL}${path}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName: '香董',
      title,
      description,
      url,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  }
}
