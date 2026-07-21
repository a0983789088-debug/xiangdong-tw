'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackMetaPixelPageView } from '@/lib/metaPixel'

function trackPageViewWhenReady(attempt = 0) {
  if (trackMetaPixelPageView()) return
  if (attempt >= 20) return

  window.setTimeout(() => {
    trackPageViewWhenReady(attempt + 1)
  }, 250)
}

export function MetaPixelPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousPath = useRef<string | null>(null)
  const queryString = searchParams.toString()
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname

  useEffect(() => {
    if (!currentPath || previousPath.current === currentPath) return

    previousPath.current = currentPath
    trackPageViewWhenReady()
  }, [currentPath])

  return null
}
