'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import * as fabric from 'fabric'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'

// Custom property declaration for placeholder tagging
declare module 'fabric' {
    interface FabricObject {
        isPlaceholder?: boolean
        placeholderIndex?: number
    }
}

interface EditorCanvasProps {
    imageUrl: string
    fontFamily?: string
    designSlug?: string
    setCanvas: (canvas: fabric.Canvas | null) => void
    onSelectionChange: (obj: fabric.FabricObject | null) => void
}

const LOTERIA_COLS = 4
const LOTERIA_ROWS = 4

// Fixed internal resolution for Lotería artboard
const LOTERIA_W = 800
const LOTERIA_H = 1120 // ~1:1.4 ratio

function isLoteriaTemplate(slug?: string): boolean {
    if (!slug) return false
    return slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes('loteria')
}

function addLoteriaGrid(canvas: fabric.Canvas) {
    // Add padding so cell strokes at the edges don't extend outside the canvas boundary
    // (strokeWidth: 1 means 0.5px extends outward from each rect edge)
    const PAD = 2
    const cellW = (LOTERIA_W - PAD * 2) / LOTERIA_COLS
    const cellH = (LOTERIA_H - PAD * 2) / LOTERIA_ROWS

    let index = 0
    for (let row = 0; row < LOTERIA_ROWS; row++) {
        for (let col = 0; col < LOTERIA_COLS; col++) {
            const rect = new fabric.Rect({
                left: PAD + col * cellW,
                top: PAD + row * cellH,
                width: cellW,
                height: cellH,
                fill: 'rgba(49, 155, 185, 0.04)',
                stroke: '#d1d5db',
                strokeWidth: 1,
                strokeUniform: true,
                selectable: true,
                hasControls: false,
                hasBorders: true,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                hoverCursor: 'pointer',
            })

            rect.isPlaceholder = true
            rect.placeholderIndex = index
            index++

            canvas.add(rect)
        }
    }
    canvas.renderAll()
}

export function EditorCanvas({ imageUrl, fontFamily, designSlug, setCanvas, onSelectionChange }: EditorCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const htmlCanvasRef = useRef<HTMLCanvasElement>(null)
    const canvasInstanceRef = useRef<fabric.Canvas | null>(null)
    const [zoomLevel, setZoomLevel] = useState(1)
    const containerSizeRef = useRef({ w: 0, h: 0 })

    const isLoteria = isLoteriaTemplate(designSlug)

    /** Calculate zoom to fit artboard in container with padding */
    const calcFitZoom = useCallback((cw: number, ch: number) => {
        const PAD = 40
        const zx = (cw - PAD * 2) / LOTERIA_W
        const zy = (ch - PAD * 2) / LOTERIA_H
        return Math.min(zx, zy, 1)
    }, [])

    /** Apply zoom: resize the Fabric canvas to the scaled artboard size and use setZoom */
    const applyZoom = useCallback((zoom: number) => {
        const canvas = canvasInstanceRef.current
        if (!canvas) return

        if (isLoteria) {
            const scaledW = Math.round(LOTERIA_W * zoom)
            const scaledH = Math.round(LOTERIA_H * zoom)
            canvas.setDimensions({ width: scaledW, height: scaledH })
            canvas.setZoom(zoom)
            canvas.renderAll()
            // Recalculate offset since canvas size/position changed
            requestAnimationFrame(() => canvas.calcOffset())
        }
        setZoomLevel(zoom)
    }, [isLoteria])

    const initCanvas = useCallback(async (cw: number, ch: number) => {
        if (!htmlCanvasRef.current) return
        if (canvasInstanceRef.current) {
            canvasInstanceRef.current.dispose()
            canvasInstanceRef.current = null
            setCanvas(null)
        }

        let canvasW: number
        let canvasH: number
        let initialZoom = 1

        if (isLoteria) {
            initialZoom = calcFitZoom(cw, ch)
            canvasW = Math.round(LOTERIA_W * initialZoom)
            canvasH = Math.round(LOTERIA_H * initialZoom)
        } else {
            canvasW = cw
            canvasH = ch
        }

        const canvas = new fabric.Canvas(htmlCanvasRef.current, {
            width: canvasW,
            height: canvasH,
            backgroundColor: '#ffffff',
            selection: true,
        })

        canvasInstanceRef.current = canvas
        setCanvas(canvas)

        if (isLoteria) {
            // Set zoom so internal coordinates match 800x1120
            canvas.setZoom(initialZoom)
            addLoteriaGrid(canvas)
            setZoomLevel(initialZoom)
        } else {
            // Normal mode: load the design image as background
            try {
                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
                const img = await fabric.FabricImage.fromURL(proxyUrl, { crossOrigin: 'anonymous' })

                if (img.width! / img.height! > canvasW / canvasH) {
                    img.scaleToWidth(canvasW * 0.9)
                } else {
                    img.scaleToHeight(canvasH * 0.9)
                }

                img.set({
                    selectable: false,
                    evented: false,
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true,
                })

                canvas.add(img)
                canvas.centerObject(img)
                canvas.sendObjectToBack(img)
                canvas.renderAll()
            } catch (err) {
                console.error('[EditorCanvas] Failed to load image:', err)
            }
        }

        // Selection events
        canvas.on('selection:created', (e) => {
            onSelectionChange(e.selected?.[0] || null)
        })
        canvas.on('selection:updated', (e) => {
            onSelectionChange(e.selected?.[0] || null)
        })
        canvas.on('selection:cleared', () => {
            onSelectionChange(null)
        })

        // Keyboard delete — protect placeholders
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
                const active = canvas.getActiveObject()
                if (active && active.selectable && !(active as any).isPlaceholder) {
                    canvas.remove(active)
                    canvas.discardActiveObject()
                    canvas.renderAll()
                    onSelectionChange(null)
                }
            }
        }
        document.addEventListener('keydown', handleKeyDown)

        // Recalculate offset AFTER flexbox layout has positioned the canvas
        // Without this, Fabric.js click coordinates are offset because it calculated
        // position before the canvas was centered by CSS flexbox
        requestAnimationFrame(() => {
            canvas.calcOffset()
        })

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [imageUrl, setCanvas, onSelectionChange, isLoteria, calcFitZoom])

    // Wait for container to have real dimensions, then init
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

    // Responsive resize
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current || !canvasInstanceRef.current || !isLoteria) return
            const rect = containerRef.current.getBoundingClientRect()
            const zoom = calcFitZoom(rect.width, rect.height)
            applyZoom(zoom)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isLoteria, calcFitZoom, applyZoom])

    // Zoom handlers
    const handleZoomIn = () => {
        const newZoom = Math.min(zoomLevel * 1.25, 2)
        applyZoom(newZoom)
    }

    const handleZoomOut = () => {
        const newZoom = Math.max(zoomLevel * 0.8, 0.15)
        applyZoom(newZoom)
    }

    const handleZoomFit = () => {
        const { w, h } = containerSizeRef.current
        if (w > 0 && h > 0) {
            applyZoom(calcFitZoom(w, h))
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{ backgroundColor: isLoteria ? '#e5e7eb' : undefined }}
        >
            {/* Canvas wrapper — the Fabric canvas is sized to the scaled artboard */}
            <div
                style={{
                    borderRadius: isLoteria ? 8 : undefined,
                    boxShadow: isLoteria ? '0 4px 24px rgba(0,0,0,0.12)' : undefined,
                    lineHeight: 0, // Remove inline gaps around canvas element
                }}
            >
                <canvas ref={htmlCanvasRef} />
            </div>

            {/* Zoom controls */}
            {isLoteria && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 px-2 py-1.5 z-50">
                    <button
                        onClick={handleZoomOut}
                        className="p-1.5 rounded hover:bg-muted/80 transition-colors"
                        title="Alejar"
                    >
                        <ZoomOut className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-xs font-medium text-muted-foreground min-w-[44px] text-center select-none">
                        {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        className="p-1.5 rounded hover:bg-muted/80 transition-colors"
                        title="Acercar"
                    >
                        <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="w-px h-4 bg-border/50 mx-0.5" />
                    <button
                        onClick={handleZoomFit}
                        className="p-1.5 rounded hover:bg-muted/80 transition-colors"
                        title="Ajustar a pantalla"
                    >
                        <Maximize className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            )}
        </div>
    )
}
