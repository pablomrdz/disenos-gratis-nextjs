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
    exportWidth?: number
    exportHeight?: number
    filledSlots?: number
    totalSlots?: number
    hasSavedState?: boolean
    onClearState?: () => void
}

type ExportFormat = 'png' | 'jpeg' | 'pdf-letter' | 'pdf-a4'

interface ExportedFile {
    blob: Blob
    filename: string
}

export function EditorHeader({
    title,
    slug,
    canvas,
    returnHref,
    itemId,
    category,
    editorType,
    exportWidth,
    exportHeight,
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
        await new Promise((resolve) => setTimeout(resolve, 150))

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

        const restorePlaceholders = () => {
            placeholderStates.forEach((state) => {
                state.obj.set({
                    visible: state.visible,
                    stroke: state.stroke,
                    strokeWidth: state.strokeWidth,
                    strokeDashArray: state.strokeDashArray,
                })
            })
            canvas.renderAll()
        }

        try {
            if (editorType === 'loteria' && totalSlots && filledSlots < totalSlots) {
                toast.warning(`Tu tabla tiene ${filledSlots} de ${totalSlots} cartas.`, {
                    description: 'Los espacios que faltan se conservarán visibles en el PDF.',
                })
            }

            canvas.discardActiveObject()

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

            const exported = format.startsWith('pdf')
                ? await exportAsPDFBlob(
                    canvas,
                    slug,
                    format === 'pdf-letter' ? 'letter' : 'a4',
                    exportWidth
                )
                : await exportAsImageBlob(
                    canvas,
                    slug,
                    format as 'png' | 'jpeg',
                    exportWidth
                )

            restorePlaceholders()

            await deliverFile(exported)

            trackEvent('editor_export', {
                item_id: itemId,
                item_name: title,
                category,
                editor_type: editorType,
                export_format: format,
                source_page: 'editor',
            })

            toast.success('Archivo listo.')
        } catch (err) {
            restorePlaceholders()

            if (err instanceof DOMException && err.name === 'AbortError') {
                toast.info('Guardado cancelado.')
                return
            }

            console.error('[EditorHeader] Export failed:', err)
            toast.error('No se pudo exportar. Intenta recargar la página.')
        } finally {
            setExporting(false)
        }
    }

    const desktopControls = (
        <>
            {hasSavedState && onClearState && (
                <button
                    onClick={onClearState}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Reiniciar diseño"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reiniciar
                </button>
            )}

            <ExportSelect format={format} setFormat={setFormat} />

            <ExportButton
                onClick={handleExport}
                exporting={exporting}
                disabled={!canvas}
                compact={false}
            />
        </>
    )

    return (
        <header className="shrink-0 border-b border-border/50 bg-background">
            <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Link
                        href={returnHref}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Volver</span>
                    </Link>

                    <div className="hidden h-6 w-px bg-border/50 sm:block" />

                    <div className="min-w-0">
                        <h1
                            className="line-clamp-1 max-w-[210px] text-sm font-semibold text-foreground sm:max-w-md"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                        {totalSlots ? (
                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                                Tabla: {filledSlots}/{totalSlots} cartas
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                    {desktopControls}
                </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border/40 px-3 py-2 sm:hidden">
                <button
                    onClick={onClearState}
                    disabled={!hasSavedState || !onClearState}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Reiniciar diseño"
                    title="Reiniciar diseño"
                >
                    <RotateCcw className="h-4 w-4" />
                </button>

                <div className="min-w-0 flex-1">
                    <ExportSelect
                        format={format}
                        setFormat={setFormat}
                        mobile
                    />
                </div>

                <ExportButton
                    onClick={handleExport}
                    exporting={exporting}
                    disabled={!canvas}
                    compact
                />
            </div>
        </header>
    )
}

function ExportSelect({
    format,
    setFormat,
    mobile = false,
}: {
    format: ExportFormat
    setFormat: (format: ExportFormat) => void
    mobile?: boolean
}) {
    return (
        <select
            value={format}
            onChange={(event) => setFormat(event.target.value as ExportFormat)}
            className={
                mobile
                    ? 'h-9 w-full rounded-lg border border-border bg-background px-2 text-[11px]'
                    : 'rounded-lg border border-border bg-background px-2 py-1.5 text-xs'
            }
            aria-label="Formato de salida"
        >
            <option value="pdf-letter">PDF Carta</option>
            <option value="pdf-a4">PDF A4</option>
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
        </select>
    )
}

function ExportButton({
    onClick,
    exporting,
    disabled,
    compact,
}: {
    onClick: () => void
    exporting: boolean
    disabled: boolean
    compact: boolean
}) {
    return (
        <Button
            onClick={onClick}
            disabled={exporting || disabled}
            className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl"
            size="sm"
        >
            {exporting ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {!compact && <span>Exportando...</span>}
                </>
            ) : (
                <>
                    <ImageDown className="h-4 w-4" />
                    <span>{compact ? 'Guardar' : 'Finalizar y Descargar'}</span>
                </>
            )}
        </Button>
    )
}

async function exportAsImageBlob(
    canvas: fabric.Canvas,
    slug: string,
    format: 'png' | 'jpeg',
    targetWidth?: number
): Promise<ExportedFile> {
    const dataUrl = canvas.toDataURL({
        format,
        quality: format === 'jpeg' ? 0.92 : 1,
        multiplier: targetWidth
            ? Math.max(1, targetWidth / Math.max(canvas.getWidth(), 1))
            : 2,
    })

    const response = await fetch(dataUrl)
    const blob = await response.blob()

    return {
        blob,
        filename: `${slug}-editado.${format}`,
    }
}

async function exportAsPDFBlob(
    canvas: fabric.Canvas,
    slug: string,
    paperSize: 'letter' | 'a4',
    targetWidth?: number
): Promise<ExportedFile> {
    const { jsPDF } = await import('jspdf')
    const multiplier = targetWidth
        ? Math.max(1, targetWidth / Math.max(canvas.getWidth(), 1))
        : 4

    const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier,
    })

    const paperDimensions = {
        letter: { w: 215.9, h: 279.4 },
        a4: { w: 210, h: 297 },
    }

    const paper = paperDimensions[paperSize]

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: paperSize === 'letter' ? 'letter' : 'a4',
    })

    const canvasW = canvas.width! * multiplier
    const canvasH = canvas.height! * multiplier
    const canvasAspect = canvasW / canvasH

    const margin = 5
    const printableW = paper.w - margin * 2
    const printableH = paper.h - margin * 2
    const printableAspect = printableW / printableH

    let imgW: number
    let imgH: number

    if (canvasAspect > printableAspect) {
        imgW = printableW
        imgH = printableW / canvasAspect
    } else {
        imgH = printableH
        imgW = printableH * canvasAspect
    }

    const offsetX = (paper.w - imgW) / 2
    const offsetY = (paper.h - imgH) / 2

    pdf.addImage(
        dataUrl,
        'PNG',
        offsetX,
        offsetY,
        imgW,
        imgH,
        undefined,
        'FAST'
    )

    return {
        blob: pdf.output('blob'),
        filename: `${slug}-listo-para-imprimir.pdf`,
    }
}

async function deliverFile({ blob, filename }: ExportedFile) {
    const file = new File([blob], filename, {
        type: blob.type || 'application/octet-stream',
    })

    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (
        isIOS &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
    ) {
        await navigator.share({
            files: [file],
            title: filename,
        })
        return
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}
