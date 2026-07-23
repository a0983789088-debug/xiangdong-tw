'use client'

import { useEffect, useState } from 'react'
import { CTA_PRESETS, normalizeCtaItem, type CtaItem } from '@/lib/cta'

type Settings = {
  floatingButton?: string
  ctas?: CtaItem[]
} | null

export function FloatingCta({ settings }: { settings: Settings }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const type = settings?.floatingButton || 'line'
  const override = settings?.ctas?.find((c) => c.type === type)
  const cta = override
    ? normalizeCtaItem(override)
    : (CTA_PRESETS as any)[type] || CTA_PRESETS.line

  return (
    <a
      href={cta.url}
      target="_blank"
      rel="noopener"
      aria-label={cta.title}
      className={`fixed bottom-5 right-5 z-40 bg-lineGreen text-white shadow-lg rounded-full px-5 py-3 text-sm font-medium flex items-center gap-2 transition-all ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="text-lg leading-none">＋</span>
      <span className="hidden sm:inline">加 LINE 領手冊</span>
      <span className="sm:hidden">LINE</span>
    </a>
  )
}
