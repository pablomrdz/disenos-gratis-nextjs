'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as fabric from 'fabric'
import { ArrowLeft, ImageDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface EditorHeaderProps {
    title: string
    slug: string
    canvas: fabric.Canvas | null
}

type ExportFormat = 'png' | 'jpeg' | 'pdf'

export function EditorHeader({ title, slug, canvas }: EditorHeaderProps) {
    const [exporting, setExporting] = useState(false)
    const [format, setFormat] = useState<ExportFormat>('png')

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

            if (format === 'pdf') {
                await exportAsPDF(canvas, slug)
            } else {
                exportAsImage(canvas, slug, format)
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

    const exportAsPDF = async (canvas: fabric.Canvas, slug: string) => {
        // Dynamic import to avoid SSR issues
        const { jsPDF } = await import('jspdf')

        // Export at high resolution for 300 DPI print quality
        // Standard print: if canvas is ~800px, multiplier 4 = 3200px
        // At 300 DPI for an 8.5"×11" page = 2550×3300px
        const multiplier = 4

        const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier,
        })

        const canvasW = canvas.width! * multiplier
        const canvasH = canvas.height! * multiplier

        // Determine orientation
        const isLandscape = canvasW > canvasH
        const orientation = isLandscape ? 'landscape' : 'portrait'

        // Create PDF with dimensions matching the canvas aspect ratio
        // Use mm units, convert from pixels at 300 DPI
        // 1 inch = 25.4mm, 300 DPI → 1px = 25.4/300 mm
        const pxToMm = 25.4 / 300
        const pdfW = canvasW * pxToMm
        const pdfH = canvasH * pxToMm

        const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format: [pdfW, pdfH],
        })

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH, undefined, 'FAST')
        pdf.save(`${slug}-editado.pdf`)
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
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                    className="hidden rounded-lg border border-border bg-background px-2 py-1.5 text-xs sm:block"
                >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPG</option>
                    <option value="pdf">PDF (300 DPI)</option>
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
