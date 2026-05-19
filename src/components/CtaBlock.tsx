import { CTA_PRESETS, getCtaColor, type CtaItem } from '@/lib/cta'

type CtaBlockProps = {
  primary?: CtaItem
  secondary?: CtaItem[]
  heading?: string
  subheading?: string
}

const ICON_BY_TYPE: Record<string, string> = {
  line: '✉',
  community: '☺',
  fbBidding: 'ƒ',
  fbKnowledge: 'ƒ',
  shop: '★',
}

export function CtaBlock({
  primary = CTA_PRESETS.line,
  secondary = [CTA_PRESETS.community, CTA_PRESETS.fbBidding, CTA_PRESETS.shop],
  heading = '下一步：跟香董聊聊',
  subheading = '選一個適合你的方式',
}: CtaBlockProps) {
  return (
    <section className="bg-cream rounded-2xl p-6 md:p-10 border border-gold/20">
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="block w-10 h-px bg-gold" />
          <span className="text-xs tracking-[3px] text-goldDark uppercase">Next</span>
          <span className="block w-10 h-px bg-gold" />
        </div>
        <h2 className="text-2xl text-navy">{heading}</h2>
        <p className="text-sm text-woodLight mt-2">{subheading}</p>
      </div>

      <CtaCard cta={primary} primary />

      <div className="grid sm:grid-cols-3 gap-3 mt-3">
        {secondary.map((c) => (
          <CtaCard key={c.type as string} cta={c} compact />
        ))}
      </div>
    </section>
  )
}

function CtaCard({
  cta,
  primary = false,
  compact = false,
}: {
  cta: CtaItem
  primary?: boolean
  compact?: boolean
}) {
  const { bg, fg } = getCtaColor(cta.type as string)
  const icon = ICON_BY_TYPE[cta.type as string] || '→'

  return (
    <a
      href={cta.url}
      target="_blank"
      rel="noopener"
      className={`group block rounded-xl transition-transform hover:-translate-y-0.5 ${
        primary ? 'p-5 md:p-6' : 'p-4'
      }`}
      style={{ background: bg, color: fg }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center justify-center rounded-full ${
            primary ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-base'
          }`}
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium leading-tight ${
              primary ? 'text-base md:text-lg' : 'text-sm'
            }`}
          >
            {cta.title}
          </p>
          {cta.description && !compact && (
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
