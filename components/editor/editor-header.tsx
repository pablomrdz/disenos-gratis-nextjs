'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as fabric from 'fabric'
import { ArrowLeft, Download, ImageDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface EditorHeaderProps {
    title: string
    slug: string
    canvas: fabric.Canvas | null
}

export function EditorHeader({ title, slug, canvas }: EditorHeaderProps) {
    const [exporting, setExporting] = useState(false)
    const [format, setFormat] = useState<'png' | 'jpeg'>('png')

    const handleExport = async () => {
        if (!canvas) return
        setExporting(true)

        // Small delay for UI feedback
        await new Promise((r) => setTimeout(r, 250))

        try {
            // Deselect any active object to avoid selection handles in export
            canvas.discardActiveObject()
            canvas.renderAll()

            const dataUrl = canvas.toDataURL({
                format,
                quality: format === 'jpeg' ? 0.92 : 1,
                multiplier: 2, // 2x resolution
            })

            const link = document.createElement('a')
            link.download = `${slug}-editado.${format}`
            link.href = dataUrl
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('[EditorHeader] Export failed:', err)
            toast.error('No se pudo exportar. Intenta recargar la página.')
        } finally {
            setExporting(false)
        }
    }

    return (
        <header className="flex items-center justify-between border-b border-border/50 bg-background px-4 py-3">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3">
                <Link
                    href={`/designs/${slug}`}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Volver</span>
                </Link>
                <div className="hidden h-6 w-px bg-border/50 sm:block" />
                <h1 className="line-clamp-1 max-w-[200px] text-sm font-semibold text-foreground sm:max-w-md" dangerouslySetInnerHTML={{ __html: title }} />
            </div>

            {/* Right: Format + Export */}
            <div className="flex items-center gap-2">
                <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
                    className="hidden rounded-lg border border-border bg-background px-2 py-1.5 text-xs sm:block"
                >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPG</option>
                </select>
                <Button
                    onClick={handleExport}
                    disabled={exporting || !canvas}
                    className="gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all"
                    size="sm"
                >
                    {exporting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="hidden sm:inline">Exportando...</span>
                        </>
                    ) : (
                        <>
                            <ImageDown className="h-4 w-4" />
                            <span className="hidden sm:inline">Finalizar y Descargar</span>
                            <span className="sm:hidden">Descargar</span>
                        </>
                    )}
                </Button>
            </div>
        </header>
    )
}
