declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: Record<string, unknown>
    ) => void
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return

  if (!window.gtag) {
    console.warn('GA4 gtag is not available')
    return
  }

  window.gtag('event', eventName, params)
}