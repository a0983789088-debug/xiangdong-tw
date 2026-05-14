import Link from 'next/link'

export type TopicHubItem = {
  label: string
  href: string
}
export type TopicHubProps = {
  icon: string
  title: string
  intro: string
  items: TopicHubItem[]
  mainLink: string
  mainLinkLabel: string
}

/**
 * 知識主題入口卡
 * 用於首頁中段的「沉香知識 / 線香推薦 / 佛珠文化」三大主題
 * 每張卡 = 一個 Topic Cluster 的入口（SEO 用）
 */
export function TopicHub({
  icon,
  title,
  intro,
  items,
  mainLink,
  mainLinkLabel,
}: TopicHubProps) {
  return (
    <article className="bg-white border border-gold/20 rounded-lg p-6 md:p-7 hover:border-gold/50 transition-colors flex flex-col">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-gold text-2xl font-serif leading-none">{icon}</span>
        <h3 className="text-xl text-navy">{title}</h3>
      </div>
      <p className="text-sm text-woodLight leading-relaxed mb-5 min-h-[3.5rem]">
        {intro}
      </p>
      <ul className="space-y-2 mb-6 flex-1">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group inline-flex items-baseline gap-2 text-sm text-wood hover:text-navy transition-colors"
            >
              <span className="text-gold opacity-60 group-hover:opacity-100">·</span>
              <span className="underline decoration-gold/40 underline-offset-4 group-hover:decoration-gold">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={mainLink}
        className="inline-flex items-center gap-1.5 text-sm text-navy border-b border-gold pb-0.5 self-start hover:text-goldDark"
      >
        <span>{mainLinkLabel}</span>
        <span>→</span>
      </Link>
    </article>
  )
}
