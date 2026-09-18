'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as fabric from 'fabric'
import { ArrowLeft, ImageDown, Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

interface EditorHeaderProps {
    title: string
    slug: string
    canvas: fabric.Canvas | null
    returnHref: string
    itemId: string
    category: string
    editorType: string
    filledSlots?: number
    totalSlots?: number
    hasSavedState?: boolean
    onClearState?: () => void
}

type ExportFormat = 'png' | 'jpeg' | 'pdf-letter' | 'pdf-a4'

export function EditorHeader({
    title,
    slug,
    canvas,
    returnHref,
    itemId,
    category,
    editorType,
    filledSlots = 0,
    totalSlots,
    hasSavedState,
    onClearState,
}: EditorHeaderProps) {
    const [exporting, setExporting] = useState(false)
    const [format, setFormat] = useState<ExportFormat>('pdf-letter')

    const handleExport = async () => {
        if (!canvas) return
        setExporting(true)

        // Small delay for UI feedback
        await new Promise((r) => setTimeout(r, 250))

        try {
            if (editorType === 'loteria' && totalSlots && filledSlots < totalSlots) {
                toast.warning(`Tu tabla tiene ${filledSlots} de ${totalSlots} cartas.`, {
                    description: 'Los espacios que faltan se conservarán visibles en el PDF.',
                })
            }

            // Deselect any active object to avoid selection handles in export
            canvas.discardActiveObject()

            // Keep a subtle printable 4×4 guide for empty Lotería slots.
            const placeholderStates = canvas
                .getObjects()
                .filter((obj: any) => obj.isPlaceholder)
                .map((obj) => ({
                    obj,
                    visible: obj.visible,
                    stroke: obj.stroke,
                    strokeWidth: obj.strokeWidth,
                    strokeDashArray: obj.strokeDashArray,
                }))

            placeholderStates.forEach(({ obj }) => {
                if (editorType === 'loteria') {
                    obj.set({
                        visible: true,
                        stroke: '#d1d5db',
                        strokeWidth: 1,
                        strokeDashArray: [],
                    })
                } else {
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

            trackEvent('editor_export', {
                item_id: itemId,
                item_name: title,
                category,
                editor_type: editorType,
                export_format: format,
                source_page: 'editor',
            })

            // Restore editor-only placeholder appearance
            placeholderStates.forEach((state) => {
                state.obj.set({
                    visible: state.visible,
                    stroke: state.stroke,
                    strokeWidth: state.strokeWidth,
                    strokeDashArray: state.strokeDashArray,
                })
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
        const margin = 5
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
        <header className="flex shrink-0 items-center justify-between border-b border-border/50 bg-background px-3 py-2.5 sm:px-4 sm:py-3">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3">
                <Link
                    href={returnHref}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Volver</span>
                </Link>
                <div className="hidden h-6 w-px bg-border/50 sm:block" />
                <div className="min-w-0">
                    <h1 className="line-clamp-1 max-w-[180px] text-sm font-semibold text-foreground sm:max-w-md" dangerouslySetInnerHTML={{ __html: title }} />
                    {totalSlots ? (
                        <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                            Tabla: {filledSlots}/{totalSlots} cartas
                        </p>
                    ) : null}
                </div>
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
