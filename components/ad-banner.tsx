"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"

export function AdBanner({ slot, responsive = true, width, height, className }: any) {
    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch (e) {
            // Silently ignore — prevents hydration / duplicate-push errors
        }
    }, [])

    return (
        <div className={cn("overflow-hidden flex justify-center w-full", className)}>
            <ins
                className="adsbygoogle"
                style={{
                    display: responsive ? 'block' : 'inline-block',
                    width: width || 'auto',
                    height: height || 'auto'
                }}
                data-ad-client="ca-pub-1784471620247875"
                data-ad-slot={slot}
                data-ad-format={responsive ? "auto" : undefined}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    )
}
