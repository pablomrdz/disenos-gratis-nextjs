'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as fabric from 'fabric'

interface EditorCanvasProps {
    imageUrl: string
    canvasRef: React.MutableRefObject<fabric.Canvas | null>
    onSelectionChange: (obj: fabric.FabricObject | null) => void
}

export function EditorCanvas({ imageUrl, canvasRef, onSelectionChange }: EditorCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const htmlCanvasRef = useRef<HTMLCanvasElement>(null)

    const initCanvas = useCallback(async () => {
        if (!htmlCanvasRef.current || !containerRef.current) return
        if (canvasRef.current) {
            canvasRef.current.dispose()
            canvasRef.current = null
        }

        const container = containerRef.current
        const width = container.clientWidth
        const height = Math.min(width * 0.75, window.innerHeight - 140)

        const canvas = new fabric.Canvas(htmlCanvasRef.current, {
            width,
            height,
            backgroundColor: '#f8f9fa',
            selection: true,
        })

        canvasRef.current = canvas

        // Load design image as background
        try {
            const img = await fabric.FabricImage.fromURL(imageUrl, {}, { crossOrigin: 'anonymous' })

            // Refined scaling: Fill most of the canvas but keep aspect ratio
            if (img.width! / img.height! > width / height) {
                img.scaleToWidth(width * 0.9)
            } else {
                img.scaleToHeight(height * 0.9)
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

        // Keyboard delete
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
                const active = canvas.getActiveObject()
                if (active && active.selectable) {
                    canvas.remove(active)
                    canvas.discardActiveObject()
                    canvas.renderAll()
                    onSelectionChange(null)
                }
            }
        }
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [imageUrl, canvasRef, onSelectionChange])

    useEffect(() => {
        initCanvas()
        return () => {
            if (canvasRef.current) {
                canvasRef.current.dispose()
                canvasRef.current = null
            }
        }
    }, [initCanvas])

    // Responsive resize
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current || !canvasRef.current) return
            const width = containerRef.current.clientWidth
            const height = Math.min(width * 0.75, window.innerHeight - 140)
            canvasRef.current.setDimensions({ width, height })
            canvasRef.current.renderAll()
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [canvasRef])

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-muted shadow-inner">
            <canvas ref={htmlCanvasRef} />
        </div>
    )
}
