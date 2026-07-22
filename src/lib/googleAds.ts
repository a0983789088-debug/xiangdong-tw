type Gtag = (...args: unknown[]) => void

const DEFAULT_GOOGLE_ADS_CONVERSION_ID = 'AW-18234251829'
const DEFAULT_GOOGLE_ADS_LINE_LEAD_CONVERSION_LABEL = 'TzzCCPHcrtQcELWO4vZD'

export const GOOGLE_ADS_CONVERSION_ID = normalizeGoogleAdsConversionId(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ||
    DEFAULT_GOOGLE_ADS_CONVERSION_ID
)

export const GOOGLE_ADS_LINE_LEAD_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LINE_LEAD_CONVERSION_LABEL?.trim() ||
  DEFAULT_GOOGLE_ADS_LINE_LEAD_CONVERSION_LABEL

export const GOOGLE_ADS_LINE_LEAD_SEND_TO =
  GOOGLE_ADS_CONVERSION_ID && GOOGLE_ADS_LINE_LEAD_CONVERSION_LABEL
    ? `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_LINE_LEAD_CONVERSION_LABEL}`
    : ''

declare global {
  interface Window {
    gtag?: Gtag
  }
}

export function trackGoogleAdsLineLeadConversion() {
  if (
    typeof window === 'undefined' ||
    typeof window.gtag !== 'function' ||
    !GOOGLE_ADS_LINE_LEAD_SEND_TO
  ) {
    return false
  }

  window.gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_LINE_LEAD_SEND_TO,
  })
  return true
}

function normalizeGoogleAdsConversionId(value?: string) {
  const id = value?.trim()
  if (!id) return ''

  return id.startsWith('AW-') ? id : `AW-${id}`
}
