"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AdBannerProps {
    className?: string
}

export function AdBanner({ className }: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null)

    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch (err) {
            // Silently ignore — prevents hydration / duplicate-push errors
        }
    }, [])

    return (
        <div className={cn("my-6 w-full overflow-hidden", className)}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center" }}
                data-ad-client="ca-pub-1784471620247875"
                data-ad-slot="9549519747"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}
