import { ArticleCard, type ArticleCardData } from './ArticleCard'

export function RelatedArticles({ articles }: { articles: ArticleCardData[] }) {
  if (!articles || articles.length === 0) return null
  return (
    <section className="mt-12 pt-10 border-t border-gold/30">
      <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
        Related Articles
      </p>
      <h2 className="font-serif text-2xl text-navy mb-6">延伸閱讀</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {articles.slice(0, 3).map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </section>
  )
}
