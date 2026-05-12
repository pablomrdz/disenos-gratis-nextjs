"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// ── Centralized AdSense slot mapping ──────────────────────────────
// All ad slot IDs are managed here. Override via env vars if needed.
const SLOT_MAP: Record<string, string> = {
  'home mobile': process.env.NEXT_PUBLIC_ADS_SLOT_HOME_MOBILE || '6765960189',
  'in feed para listas': process.env.NEXT_PUBLIC_ADS_SLOT_IN_FEED || '1352493197',
  'after h1': process.env.NEXT_PUBLIC_ADS_SLOT_AFTER_H1 || '9549519747',
  'sidebar': process.env.NEXT_PUBLIC_ADS_SLOT_SIDEBAR || '3806846005',
  'editor leaderboard': process.env.NEXT_PUBLIC_ADS_SLOT_EDITOR_LB || '9549519747',
  'editor mobile': process.env.NEXT_PUBLIC_ADS_SLOT_EDITOR_MOBILE || '6765960189',
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADS_CLIENT || 'ca-pub-1784471620247875'

interface AdBannerProps {
  /** Named slot from SLOT_MAP, OR a raw AdSense slot string */
  slot: string
  /** If true, uses auto format and full-width responsive. Default: true */
  responsive?: boolean
  width?: number | string
  height?: number | string
  className?: string
  /** Minimum height for the container. Default: 100 */
  minHeight?: number | string
}

export function AdBanner({
  slot,
  responsive = true,
  width,
  height,
  className,
  minHeight = 100,
}: AdBannerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const isActive = process.env.NEXT_PUBLIC_ADS_ACTIVE === "true"

  // Resolve named slot → AdSense ID, or use raw value
  const resolvedSlot = SLOT_MAP[slot] || slot

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && isActive) {
      const timer = setTimeout(() => {
        try {
          ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch (e) {
          console.error('AdSense Error:', e)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isMounted, isActive])

  const containerStyle = {
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
  }

  // SSR placeholder — prevents hydration mismatch + CLS
  if (!isMounted) {
    return <div className={cn("w-full bg-transparent", className)} style={containerStyle} />
  }

  // Dev mode placeholder when ads are not active
  if (!isActive) {
    return (
      <div
        style={containerStyle}
        className={cn(
          "w-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center rounded-lg overflow-hidden my-4 transition-colors hover:bg-muted/50",
          className
        )}
      >
        <div className="text-center p-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Advertisement</p>
          <p className="text-xs text-muted-foreground/70 mt-1 font-mono">{resolvedSlot}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden flex justify-center w-full", className)}>
      <ins
        className="adsbygoogle"
        style={{
          display: responsive ? 'block' : 'inline-block',
          width: width || 'auto',
          height: height || 'auto',
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={resolvedSlot}
        data-ad-format={responsive ? "auto" : undefined}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}
