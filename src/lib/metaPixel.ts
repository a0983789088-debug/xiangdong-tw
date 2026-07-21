export const META_PIXEL_ID = '553294455210273'

type MetaPixelParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

export function trackMetaPixelPageView() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false

  window.fbq('track', 'PageView')
  return true
}

export function trackMetaPixelLead() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false

  window.fbq('track', 'Lead')
  return true
}

export function trackMetaPixelCustomEvent(
  eventName: string,
  params?: MetaPixelParams
) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false

  window.fbq('trackCustom', eventName, params)
  return true
}
