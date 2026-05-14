export type FaqItem = { question: string; answer: string }

export function FaqSection({
  items,
  title = '常見問題',
}: {
  items: FaqItem[]
  title?: string
}) {
  if (!items || items.length === 0) return null
  return (
    <section className="mt-12 pt-10 border-t border-gold/30">
      <h2 className="font-serif text-2xl text-navy mb-6">{title}</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="group bg-cream border border-gold/20 rounded-lg overflow-hidden"
          >
            <summary className="cursor-pointer list-none p-4 md:p-5 flex items-start gap-3">
              <span className="text-gold font-medium text-sm pt-0.5">Q.</span>
              <span className="flex-1 text-navy font-medium leading-snug">
                {item.question}
              </span>
              <span className="text-gold text-lg leading-none group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="px-4 md:px-5 pb-5 pt-1 pl-10 text-sm text-wood leading-relaxed whitespace-pre-line">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
