type GaParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackGaEvent(eventName: string, params?: GaParams) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false
  }

  window.gtag('event', eventName, params || {})
  return true
}
