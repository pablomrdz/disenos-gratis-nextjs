    "use client"

    import { useEffect, useState } from "react"
    import { cn } from "@/lib/utils"

    interface GoogleAdProps {
        adUnitName: string
        className?: string
        height?: number | string
        slot?: string
    }

    export function GoogleAd({ adUnitName, className, height = 250, slot: customSlot }: GoogleAdProps) {
        const [isActive, setIsActive] = useState(false)

        const slotMapping: Record<string, string> = {
            'home mobile': '6765960189',
            'in feed para listas': '1352493197',
            'despúes de cada h1': '9549519747',
            'sidebar': '3806846005'
        }

        const slot = customSlot || slotMapping[adUnitName]

        useEffect(() => {
            setIsActive(process.env.NEXT_PUBLIC_ADS_ACTIVE === "true")
        }, [])

        const style = {
            minHeight: typeof height === "number" ? `${height}px` : height,
        }

        if (!isActive) {
            return (
                <div
                    style={style}
                    className={cn(
                        "w-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center rounded-lg overflow-hidden my-4 transition-colors hover:bg-muted/50",
                        className
                    )}
                >
                    <div className="text-center p-4">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Anuncio Reservado</p>
                        <p className="text-xs text-muted-foreground/70 mt-1 font-mono">{adUnitName}</p>
                    </div>
                </div>
            )
        }

        return (
            <div
                style={style}
                className={cn("w-full overflow-hidden my-4", className)}
            >
                {/* AdSense Slot Implementation */}
                <ins
                    className="adsbygoogle"
                    style={{ display: "block", textAlign: "center", ...style }}
                    data-ad-client={process.env.NEXT_PUBLIC_ADS_CLIENT}
                    data-ad-slot={slot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
                    }}
                />
            </div>
        )
    }
