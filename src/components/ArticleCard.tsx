import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'

export type ArticleCardData = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: any
  category?: { name: string; slug: string } | null
  publishedAt?: string
  readingMinutes?: number
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  const imageUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(800).height(500).url()
    : null
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '.')
    : ''

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block rounded-lg overflow-hidden border border-gold/20 bg-white hover:border-gold/50 transition-colors"
    >
      <div className="aspect-[16/10] bg-cream overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gold/40 text-sm">
            （封面圖）
          </div>
        )}
        {article.category && (
          <span className="absolute top-3 left-3 bg-navy/90 text-cream text-[11px] px-2.5 py-1 rounded">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-[11px] text-woodLight mb-2">
          {date && <span>{date}</span>}
          {article.readingMinutes && (
            <>
              <span className="opacity-50">·</span>
              <span>閱讀時間 {article.readingMinutes} 分鐘</span>
            </>
          )}
        </div>
        <h3 className="text-lg text-navy leading-snug mb-2 group-hover:text-goldDark transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-woodLight line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <p className="text-xs text-gold inline-flex items-center gap-1 mt-4">
          <span>讀全文</span>
          <span>→</span>
        </p>
      </div>
    </Link>
  )
}
