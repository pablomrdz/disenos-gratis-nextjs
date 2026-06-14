'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { loadCustomFontFromSupabase } from '@/lib/font-loader'

interface FontPreviewInteractiveProps {
    className?: string
    isLarge?: boolean
    initialText?: string
    fontFamilyName?: string | null
}

export function FontPreviewInteractive({
    className,
    isLarge = false,
    initialText = 'Tipografía de prueba para tu diseño',
    fontFamilyName
}: FontPreviewInteractiveProps) {
    const [previewText, setPreviewText] = useState(initialText)
    const [loadedFontFamily, setLoadedFontFamily] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    console.log("🔍 PROBADOR DETALLE - Prop fontFamilyName recibido:", fontFamilyName);

    useEffect(() => {
        if (!fontFamilyName) return

        let isMounted = true
        setIsLoading(true)
        
        const sanitizedFamilyName = fontFamilyName.replace(/['"]/g, "").trim();
        const fontRef = sanitizedFamilyName;

        async function loadFont() {
            console.log("🚀 PROBADOR DETALLE - Iniciando descarga para la familia:", fontRef);
            try {
                const loadedFamily = await loadCustomFontFromSupabase(fontRef)
                
                if (!loadedFamily) {
                    throw new Error("Font not found in storage (returned empty string)");
                }

                // Force state update only after font has fully loaded and CSS is ready
                await document.fonts.ready;
                
                if (isMounted) {
                    const cleanName = loadedFamily.replace(/['"]/g, "").replace(/\.[^/.]+$/, "").trim();
                    setTimeout(() => {
                        if (isMounted) {
                            setLoadedFontFamily(cleanName);
                        }
                    }, 50);
                }
            } catch (err) {
                console.error("❌ Error real al cargar la fuente de Supabase:", err)
                if (isMounted) {
                    setLoadedFontFamily('sans-serif')
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadFont()

        return () => {
            isMounted = false
        }
    }, [fontFamilyName])

    const appliedFontFamily = loadedFontFamily ? `'${loadedFontFamily}', sans-serif` : 'sans-serif'
    console.log("🎨 FONT FAMILY APLICADO EN INPUT:", appliedFontFamily);

    return (
        <div className={cn("space-y-4", className)}>
            <div
                className={cn(
                    "flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 to-muted transition-colors relative",
                    isLarge ? "min-h-[300px] p-8 md:p-12 rounded-2xl" : "min-h-[120px] p-6 rounded-xl"
                )}
            >
                <p
                    className={cn(
                        "text-center leading-relaxed text-foreground w-full break-words px-4",
                        isLarge ? "text-4xl sm:text-5xl md:text-6xl" : "text-2xl sm:text-3xl",
                        isLoading && "opacity-50 transition-opacity"
                    )}
                    style={{ fontFamily: appliedFontFamily }}
                >
                    {previewText}
                </p>
                {isLoading && (
                    <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground animate-pulse">
                        Cargando fuente...
                    </span>
                )}
            </div>

            <div className="relative group">
                <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Escribe aquí para probar la fuente..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    style={{ fontFamily: appliedFontFamily }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground opacity-0 transition-opacity group-focus-within:opacity-100 italic">
                    Vista previa en vivo
                </div>
            </div>
        </div>
    )
}
