'use client'

import type { AnchorHTMLAttributes } from 'react'
import {
  trackMetaPixelCustomEvent,
  trackMetaPixelLead,
} from '@/lib/metaPixel'
import { trackGoogleAdsLineLeadConversion } from '@/lib/googleAds'

type MetaPixelTrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: 'Lead' | 'JoinGroup'
  eventParams?: Record<string, string | number | boolean>
  googleAdsConversion?: 'lineLead'
}

export function MetaPixelTrackedLink({
  eventName,
  eventParams,
  googleAdsConversion,
  onClick,
  ...props
}: MetaPixelTrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        if (eventName === 'Lead') {
          trackMetaPixelLead()

          if (googleAdsConversion === 'lineLead') {
            trackGoogleAdsLineLeadConversion()
          }
        } else {
          trackMetaPixelCustomEvent(eventName, eventParams)
        }

        onClick?.(event)
      }}
    />
  )
}
