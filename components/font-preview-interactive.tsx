'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FontPreviewInteractiveProps {
    className?: string
    isLarge?: boolean
    initialText?: string
}

export function FontPreviewInteractive({
    className,
    isLarge = false,
    initialText = 'Tipografía de prueba para tu diseño'
}: FontPreviewInteractiveProps) {
    const [previewText, setPreviewText] = useState(initialText)

    return (
        <div className={cn("space-y-4", className)}>
            <div
                className={cn(
                    "flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted transition-colors",
                    isLarge ? "min-h-[300px] p-8 md:p-12 rounded-2xl" : "min-h-[120px] p-6 rounded-xl"
                )}
            >
                <p
                    className={cn(
                        "text-center leading-relaxed text-foreground",
                        isLarge ? "text-4xl sm:text-5xl md:text-6xl" : "text-2xl sm:text-3xl"
                    )}
                    style={{ fontFamily: 'serif' }}
                >
                    {previewText}
                </p>
            </div>

            <div className="relative group">
                <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Escribe aquí para probar la fuente..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground opacity-0 transition-opacity group-focus-within:opacity-100 italic">
                    Vista previa en vivo
                </div>
            </div>
        </div>
    )
}
