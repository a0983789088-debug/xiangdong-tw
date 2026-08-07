'use client'

import { useEffect, useRef, useState } from 'react'
import {
  trackMetaPixelCustomEvent,
  trackMetaPixelViewContent,
} from '@/lib/metaPixel'

function trackViewContentWhenReady(value: number, attempt = 0) {
  if (trackMetaPixelViewContent(value)) return
  if (attempt >= 20) return

  window.setTimeout(() => {
    trackViewContentWhenReady(value, attempt + 1)
  }, 250)
}

export function StarterViewContent({ value }: { value: number }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackViewContentWhenReady(value)
  }, [value])

  return null
}

function withInboundUtm(checkoutUrl: string) {
  try {
    const destination = new URL(checkoutUrl)
    const inbound = new URLSearchParams(window.location.search)

    inbound.forEach((value, key) => {
      if (key.toLowerCase().startsWith('utm_')) {
        destination.searchParams.set(key, value)
      }
    })

    return destination.toString()
  } catch {
    return checkoutUrl
  }
}

export function StarterShopLink({
  checkoutUrl,
  value,
  placement,
  className,
  children,
}: {
  checkoutUrl: string
  value: number
  placement: 'primary' | 'secondary'
  className?: string
  children: React.ReactNode
}) {
  const [href, setHref] = useState(checkoutUrl)

  useEffect(() => {
    setHref(withInboundUtm(checkoutUrl))
  }, [checkoutUrl])

  return (
    <a
      href={href}
      className={className}
      onClick={() =>
        trackMetaPixelCustomEvent('ClickToShop', {
          value,
          currency: 'TWD',
          placement,
        })
      }
    >
      {children}
    </a>
  )
}
