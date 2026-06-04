"use client"

import { useEffect } from "react"

interface AdUnitProps {
  slot: string
  format?: string
  layoutKey?: string
  style?: React.CSSProperties
  className?: string
}

export function AdUnit({
  slot,
  format,
  layoutKey,
  style,
  className,
}: AdUnitProps) {
  useEffect(() => {
    try {
      // Push empty object once component mounts on the client
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense push failed (likely an active AdBlocker):', e)
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className || ''}`.trim()}
      style={style}
      data-ad-client="ca-pub-1784471620247875"
      data-ad-slot={slot}
      {...(format ? { "data-ad-format": format } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  )
}
