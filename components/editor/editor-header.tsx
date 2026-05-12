'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as fabric from 'fabric'
import { ArrowLeft, ImageDown, Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface EditorHeaderProps {
    title: string
    slug: string
    canvas: fabric.Canvas | null
    hasSavedState?: boolean
    onClearState?: () => void
}

type ExportFormat = 'png' | 'jpeg' | 'pdf-letter' | 'pdf-a4'

export function EditorHeader({ title, slug, canvas, hasSavedState, onClearState }: EditorHeaderProps) {
    const [exporting, setExporting] = useState(false)
    const [format, setFormat] = useState<ExportFormat>('pdf-letter')

    const handleExport = async () => {
        if (!canvas) return
        setExporting(true)

        // Small delay for UI feedback
        await new Promise((r) => setTimeout(r, 250))

        try {
            // Deselect any active object to avoid selection handles in export
            canvas.discardActiveObject()

            // Hide any remaining placeholders before export
            const placeholders: fabric.FabricObject[] = []
            canvas.getObjects().forEach(obj => {
                if ((obj as any).isPlaceholder) {
                    placeholders.push(obj)
                    obj.set({ visible: false })
                }
            })

            canvas.renderAll()

            if (format.startsWith('pdf')) {
                const paperSize = format === 'pdf-letter' ? 'letter' : 'a4'
                await exportAsPDF(canvas, slug, paperSize)
            } else {
                exportAsImage(canvas, slug, format as 'png' | 'jpeg')
            }

            // Restore placeholders visibility
            placeholders.forEach(obj => {
                obj.set({ visible: true })
            })
            canvas.renderAll()

        } catch (err) {
            console.error('[EditorHeader] Export failed:', err)
            toast.error('No se pudo exportar. Intenta recargar la página.')
        } finally {
            setExporting(false)
        }
    }

    const exportAsImage = (canvas: fabric.Canvas, slug: string, fmt: 'png' | 'jpeg') => {
        const dataUrl = canvas.toDataURL({
            format: fmt,
            quality: fmt === 'jpeg' ? 0.92 : 1,
            multiplier: 2,
        })

        const link = document.createElement('a')
        link.download = `${slug}-editado.${fmt}`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportAsPDF = async (canvas: fabric.Canvas, slug: string, paperSize: 'letter' | 'a4') => {
        // Dynamic import to avoid SSR issues
        const { jsPDF } = await import('jspdf')

        // Export at high resolution for 300 DPI print quality
        const multiplier = 4

        const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier,
        })

        // Paper dimensions in mm
        const paperDimensions = {
            letter: { w: 215.9, h: 279.4 },  // 8.5 x 11 inches
            a4: { w: 210, h: 297 },
        }

        const paper = paperDimensions[paperSize]

        // Create PDF with standard paper size (portrait)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: paperSize === 'letter' ? 'letter' : 'a4',
        })

        // Calculate canvas aspect ratio
        const canvasW = canvas.width! * multiplier
        const canvasH = canvas.height! * multiplier
        const canvasAspect = canvasW / canvasH

        // Define print margins (10mm on each side)
        const margin = 10
        const printableW = paper.w - (margin * 2)
        const printableH = paper.h - (margin * 2)
        const printableAspect = printableW / printableH

        // Fit canvas within printable area maintaining aspect ratio
        let imgW: number, imgH: number
        if (canvasAspect > printableAspect) {
            // Canvas is wider relative to paper - fit by width
            imgW = printableW
            imgH = printableW / canvasAspect
        } else {
            // Canvas is taller relative to paper - fit by height
            imgH = printableH
            imgW = printableH * canvasAspect
        }

        // Center on page
        const offsetX = (paper.w - imgW) / 2
        const offsetY = (paper.h - imgH) / 2

        pdf.addImage(dataUrl, 'PNG', offsetX, offsetY, imgW, imgH, undefined, 'FAST')
        pdf.save(`${slug}-listo-para-imprimir.pdf`)
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

            {/* Right: Format + Reset + Export */}
            <div className="flex items-center gap-2">
                {/* Reset saved state button */}
                {hasSavedState && onClearState && (
                    <button
                        onClick={onClearState}
                        className="hidden sm:flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Reiniciar diseño (borrar progreso guardado)"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reiniciar
                    </button>
                )}
                <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                    className="hidden rounded-lg border border-border bg-background px-2 py-1.5 text-xs sm:block"
                >
                    <option value="pdf-letter">PDF Carta (8.5×11&quot;)</option>
                    <option value="pdf-a4">PDF A4</option>
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
