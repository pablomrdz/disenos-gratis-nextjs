'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { Maximize, ZoomIn, ZoomOut } from 'lucide-react'
import type { EditorConfig } from '@/lib/types'

declare module 'fabric' {
    interface FabricObject {
        editorFieldId?: string
        isEditorBackground?: boolean
    }
}

interface InvitationCanvasProps {
    config: EditorConfig
    setCanvas: (canvas: fabric.Canvas | null) => void
    onSelectionChange: (obj: fabric.FabricObject | null) => void
}

export function InvitationCanvas({
    config,
    setCanvas,
    onSelectionChange,
}: InvitationCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const htmlCanvasRef = useRef<HTMLCanvasElement>(null)
    const canvasInstanceRef = useRef<fabric.Canvas | null>(null)
    const containerSizeRef = useRef({ w: 0, h: 0 })
    const [zoomLevel, setZoomLevel] = useState(1)

    const artboardW = config.canvas.width
    const artboardH = config.canvas.height

    const calcFitZoom = useCallback((cw: number, ch: number) => {
        const pad = 24
        const zx = (cw - pad * 2) / artboardW
        const zy = (ch - pad * 2) / artboardH
        return Math.min(zx, zy, 1)
    }, [artboardH, artboardW])

    const applyZoom = useCallback((zoom: number) => {
        const canvas = canvasInstanceRef.current
        if (!canvas) return

        canvas.setDimensions({
            width: Math.round(artboardW * zoom),
            height: Math.round(artboardH * zoom),
        })
        canvas.setZoom(zoom)
        canvas.renderAll()
        setZoomLevel(zoom)

        requestAnimationFrame(() => canvas.calcOffset())
    }, [artboardH, artboardW])

    const initCanvas = useCallback(async (cw: number, ch: number) => {
        if (!htmlCanvasRef.current) return

        if (canvasInstanceRef.current) {
            canvasInstanceRef.current.dispose()
            canvasInstanceRef.current = null
            setCanvas(null)
        }

        const initialZoom = calcFitZoom(cw, ch)
        const canvas = new fabric.Canvas(htmlCanvasRef.current, {
            width: Math.round(artboardW * initialZoom),
            height: Math.round(artboardH * initialZoom),
            backgroundColor: '#ffffff',
            selection: false,
        })

        canvasInstanceRef.current = canvas
        canvas.setZoom(initialZoom)
        setZoomLevel(initialZoom)

        try {
            if (config.backgroundUrl) {
                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(config.backgroundUrl)}`
                const bg = await fabric.FabricImage.fromURL(proxyUrl, {
                    crossOrigin: 'anonymous',
                })

                bg.set({
                    left: 0,
                    top: 0,
                    originX: 'left',
                    originY: 'top',
                    scaleX: artboardW / (bg.width || artboardW),
                    scaleY: artboardH / (bg.height || artboardH),
                    selectable: false,
                    evented: false,
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true,
                })
                ;(bg as any).isEditorBackground = true

                canvas.add(bg)
                canvas.sendObjectToBack(bg)
            }

            for (const field of config.textFields || []) {
                const text = new fabric.Textbox(field.defaultText, {
                    left: field.x,
                    top: field.y,
                    width: field.width || 420,
                    originX: 'center',
                    originY: 'center',
                    fontFamily: field.fontFamily || 'Arial',
                    fontSize: field.fontSize,
                    fill: field.fill || '#111111',
                    textAlign: field.textAlign || 'center',
                    fontWeight: field.fontWeight || 'normal',
                    fontStyle: field.fontStyle || 'normal',
                    lineHeight: 1.05,
                    selectable: false,
                    evented: false,
                    editable: false,
                })

                ;(text as any).editorFieldId = field.id
                canvas.add(text)
                canvas.bringObjectToFront(text)
            }

            canvas.renderAll()
            setCanvas(canvas)
            onSelectionChange(null)
            requestAnimationFrame(() => canvas.calcOffset())
        } catch (err) {
            console.error('[InvitationCanvas] Failed to initialize:', err)
            setCanvas(canvas)
        }
    }, [artboardH, artboardW, calcFitZoom, config.backgroundUrl, config.textFields, onSelectionChange, setCanvas])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let initialized = false
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) return

            const { width, height } = entry.contentRect
            containerSizeRef.current = { w: width, h: height }

            if (width > 0 && height > 0 && !initialized) {
                initialized = true
                initCanvas(width, height)
            }
        })

        observer.observe(container)

        return () => {
            observer.disconnect()
            if (canvasInstanceRef.current) {
                canvasInstanceRef.current.dispose()
                canvasInstanceRef.current = null
                setCanvas(null)
            }
        }
    }, [initCanvas, setCanvas])

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current || !canvasInstanceRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            applyZoom(calcFitZoom(rect.width, rect.height))
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [applyZoom, calcFitZoom])

    const handleZoomIn = () => {
        applyZoom(Math.min(zoomLevel * 1.2, 2))
    }

    const handleZoomOut = () => {
        applyZoom(Math.max(zoomLevel * 0.8, 0.15))
    }

    const handleZoomFit = () => {
        const { w, h } = containerSizeRef.current
        if (w > 0 && h > 0) applyZoom(calcFitZoom(w, h))
    }

    return (
        <div
            ref={containerRef}
            className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-200"
        >
            <div className="overflow-hidden rounded-lg bg-white shadow-xl" style={{ lineHeight: 0 }}>
                <canvas ref={htmlCanvasRef} />
            </div>

            <div className="absolute bottom-4 right-4 z-50 flex items-center gap-1 rounded-lg border border-border/50 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
                <button onClick={handleZoomOut} className="rounded p-1.5 transition-colors hover:bg-muted/80" title="Alejar">
                    <ZoomOut className="h-4 w-4 text-gray-600" />
                </button>
                <span className="min-w-[44px] select-none text-center text-xs font-medium text-muted-foreground">
                    {Math.round(zoomLevel * 100)}%
                </span>
                <button onClick={handleZoomIn} className="rounded p-1.5 transition-colors hover:bg-muted/80" title="Acercar">
                    <ZoomIn className="h-4 w-4 text-gray-600" />
                </button>
                <div className="mx-0.5 h-4 w-px bg-border/50" />
                <button onClick={handleZoomFit} className="rounded p-1.5 transition-colors hover:bg-muted/80" title="Ajustar a pantalla">
                    <Maximize className="h-4 w-4 text-gray-600" />
                </button>
            </div>
        </div>
    )
}
