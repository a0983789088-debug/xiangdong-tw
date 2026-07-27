'use client'

import type { AnchorHTMLAttributes } from 'react'
import { trackGaEvent } from '@/lib/ga'
import { trackMetaPixelCustomEvent } from '@/lib/metaPixel'

type TrackedShopLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  trackingName: string
  trackingCategory?: string
  trackingPrice?: string
  trackingType?: 'product' | 'shop_home'
  isCollectible?: boolean
}

export function TrackedShopLink({
  trackingName,
  trackingCategory,
  trackingPrice,
  trackingType = 'product',
  isCollectible,
  href,
  onClick,
  ...props
}: TrackedShopLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        const url = typeof href === 'string' ? href : ''
        const params = {
          product_name: trackingName,
          product_category: trackingCategory,
          price_label: trackingPrice,
          destination_url: url,
          link_type: trackingType,
          is_collectible: isCollectible,
        }

        trackMetaPixelCustomEvent('ShopClick', params)
        trackGaEvent('click_shop_product', params)

        onClick?.(event)
      }}
    />
  )
}
