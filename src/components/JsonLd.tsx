/**
 * JSON-LD schema.org structured data
 * 注入到 <head> 給 Google 看，產生 Rich Snippet
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function buildArticleJsonLd(opts: {
  title: string
  description?: string
  url: string
  imageUrl?: string
  publishedAt?: string
  category?: string
  authorName?: string
  siteName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    image: opts.imageUrl ? [opts.imageUrl] : undefined,
    datePublished: opts.publishedAt,
    dateModified: opts.publishedAt,
    author: {
      '@type': 'Person',
      name: opts.authorName || '香董',
    },
    publisher: {
      '@type': 'Organization',
      name: opts.siteName || '香董',
      url: 'https://xiangdong.tw',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': opts.url,
    },
    articleSection: opts.category,
  }
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.answer,
      },
    })),
  }
}

export function buildBreadcrumbJsonLd(
  items: Array<{ label: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: it.url,
    })),
  }
}
