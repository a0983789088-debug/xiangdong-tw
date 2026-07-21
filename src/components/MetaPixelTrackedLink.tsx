'use client'

import type { AnchorHTMLAttributes } from 'react'
import {
  trackMetaPixelCustomEvent,
  trackMetaPixelLead,
} from '@/lib/metaPixel'

type MetaPixelTrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: 'Lead' | 'JoinGroup'
  eventParams?: Record<string, string | number | boolean>
}

export function MetaPixelTrackedLink({
  eventName,
  eventParams,
  onClick,
  ...props
}: MetaPixelTrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        if (eventName === 'Lead') {
          trackMetaPixelLead()
        } else {
          trackMetaPixelCustomEvent(eventName, eventParams)
        }

        onClick?.(event)
      }}
    />
  )
}
