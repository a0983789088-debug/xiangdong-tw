'use client'

import { useEffect, useState } from 'react'

type TocItem = { id: string; text: string; level: 2 | 3 }

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (items.length < 3) return null

  return (
    <nav aria-label="目錄" className="bg-cream border border-gold/30 rounded-lg p-5 sticky top-24">
      <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">目錄</p>
      <ul className="space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${it.id}`}
              className={`block leading-snug transition-colors ${
                active === it.id
                  ? 'text-navy font-medium'
                  : 'text-woodLight hover:text-navy'
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
