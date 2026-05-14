import { resolveCtasForArticle, type CtaItem, getCtaColor } from '@/lib/cta'

/**
 * 文章底部的智慧 CTA 區塊。
 * 根據 article.ctaOverride + siteSettings.ctas，決定主推哪張、次推哪些。
 */
export function ArticleCta({
  ctaOverride,
  siteCtas,
}: {
  ctaOverride?: string | null
  siteCtas?: CtaItem[]
}) {
  const { primary, secondary } = resolveCtasForArticle(ctaOverride, siteCtas)

  return (
    <section className="mt-12 pt-10 border-t border-gold/30">
      <div className="text-center mb-6">
        <p className="text-xs tracking-[3px] text-gold uppercase mb-2">Next</p>
        <p className="font-serif text-xl text-navy">下一步：跟香董聊聊</p>
      </div>

      <CtaButton cta={primary} primary />

      <div className="grid sm:grid-cols-3 gap-3 mt-3">
        {secondary.map((c) => (
          <CtaButton key={c.type as string} cta={c} />
        ))}
      </div>
    </section>
  )
}

function CtaButton({ cta, primary = false }: { cta: CtaItem; primary?: boolean }) {
  const { bg, fg } = getCtaColor(cta.type as string)
  return (
    <a
      href={cta.url}
      target="_blank"
      rel="noopener"
      className={`group block rounded-lg transition-transform hover:-translate-y-0.5 ${
        primary ? 'p-5' : 'p-3.5'
      }`}
      style={{ background: bg, color: fg }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className={`font-medium leading-tight ${primary ? 'text-base' : 'text-sm'}`}>
            {cta.title}
          </p>
          {cta.description && primary && (
            <p className="text-xs opacity-90 mt-1 leading-snug">
              {cta.description}
            </p>
          )}
        </div>
        <span className="text-lg group-hover:translate-x-0.5 transition-transform">→</span>
      </div>
    </a>
  )
}
