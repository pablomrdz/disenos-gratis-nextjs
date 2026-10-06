'use client'

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { Download, ImagePlus, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MockupPreset } from './mockup-presets'

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

interface MockupEditorProps {
  preset: MockupPreset
}

export function MockupEditor({ preset }: MockupEditorProps) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const designRef = useRef<fabric.FabricImage | null>(null)
  const guideRef = useRef<fabric.Rect | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasDesign, setHasDesign] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [canExport, setCanExport] = useState(true)

  const centerDesign = useCallback(() => {
    const design = designRef.current
    const canvas = canvasRef.current
    if (!design || !canvas) return

    const { left, top, width, height } = preset.printArea
    const scale = Math.min(width / (design.width || width), height / (design.height || height)) * 0.78

    design.set({
      left: left + width / 2,
      top: top + height / 2,
      originX: 'center',
      originY: 'center',
      scaleX: scale,
      scaleY: scale,
      angle: 0,
    })
    design.setCoords()
    canvas.setActiveObject(design)
    canvas.renderAll()
  }, [preset.printArea])

  const resizeForPreview = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const availableWidth = Math.max(container.clientWidth - 24, 1)
    const availableHeight = Math.max(window.innerHeight * 0.72, 360)
    const scale = Math.min(availableWidth / preset.width, availableHeight / preset.height, 0.62)

    canvas.setDimensions(
      { width: Math.round(preset.width * scale), height: Math.round(preset.height * scale) },
      { cssOnly: true },
    )
    canvas.calcOffset()
  }, [preset.height, preset.width])

  useEffect(() => {
    const element = canvasElementRef.current
    if (!element) return

    let cancelled = false
    const canvas = new fabric.Canvas(element, {
      width: preset.width,
      height: preset.height,
      preserveObjectStacking: true,
      selection: false,
    })
    canvasRef.current = canvas
    resizeForPreview()

    const guide = new fabric.Rect({
      left: preset.printArea.left,
      top: preset.printArea.top,
      width: preset.printArea.width,
      height: preset.printArea.height,
      originX: 'left',
      originY: 'top',
      fill: 'rgba(37, 99, 235, 0.08)',
      stroke: '#2563eb',
      strokeWidth: 4,
      strokeDashArray: [18, 12],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    })
    guideRef.current = guide

    const loadBackground = async () => {
      try {
        // Hetzner must permit CORS for this path to keep canvas exportable.
        let background: fabric.FabricImage
        try {
          background = await fabric.FabricImage.fromURL(preset.backgroundUrl, {
            crossOrigin: 'anonymous',
          })
          if (!cancelled) setCanExport(true)
        } catch {
          // Preserve an interactive preview even if bucket CORS is pending.
          background = await fabric.FabricImage.fromURL(preset.backgroundUrl)
          if (!cancelled) setCanExport(false)
        }

        if (cancelled) return

        background.set({
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          selectable: false,
          evented: false,
          scaleX: preset.width / (background.width || preset.width),
          scaleY: preset.height / (background.height || preset.height),
        })
        canvas.add(background)
        canvas.add(guide)
        canvas.sendObjectToBack(background)
        canvas.renderAll()
        setIsReady(true)
      } catch {
        if (!cancelled) {
          setError('No se pudo cargar el fondo del mockup. Intenta recargar la página.')
        }
      }
    }

    void loadBackground()

    const observer = new ResizeObserver(resizeForPreview)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      cancelled = true
      observer.disconnect()
      canvas.dispose()
      canvasRef.current = null
      designRef.current = null
      guideRef.current = null
    }
  }, [preset, resizeForPreview])

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Selecciona una imagen PNG, JPG o WEBP. Los archivos SVG no están permitidos.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Tu imagen debe pesar máximo 8 MB.')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    setError(null)
    const objectUrl = URL.createObjectURL(file)

    try {
      const image = await fabric.FabricImage.fromURL(objectUrl)
      URL.revokeObjectURL(objectUrl)

      if (designRef.current) canvas.remove(designRef.current)

      const clipPath = new fabric.Rect({
        left: preset.printArea.left,
        top: preset.printArea.top,
        width: preset.printArea.width,
        height: preset.printArea.height,
        originX: 'left',
        originY: 'top',
      })
      ;(clipPath as fabric.Rect & { absolutePositioned?: boolean }).absolutePositioned = true

      image.set({
        originX: 'center',
        originY: 'center',
        cornerColor: '#2563eb',
        borderColor: '#2563eb',
        cornerStrokeColor: '#ffffff',
        transparentCorners: false,
        padding: 8,
        clipPath,
      })

      designRef.current = image
      canvas.add(image)
      centerDesign()
      if (guideRef.current) canvas.bringObjectToFront(guideRef.current)
      setHasDesign(true)
    } catch {
      URL.revokeObjectURL(objectUrl)
      setError('No pudimos leer esa imagen. Prueba con otro archivo PNG, JPG o WEBP.')
    }
  }

  const removeDesign = () => {
    const canvas = canvasRef.current
    if (canvas && designRef.current) canvas.remove(designRef.current)
    designRef.current = null
    setHasDesign(false)
    canvas?.renderAll()
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas || !isReady) return

    setError(null)
    setIsExporting(true)
    const guide = guideRef.current

    try {
      if (guide) guide.visible = false
      canvas.discardActiveObject()
      canvas.renderAll()

      const dataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: 1,
        enableRetinaScaling: false,
      })
      const link = document.createElement('a')
      link.download = `mockup-${preset.slug}.png`
      link.href = dataUrl
      link.click()
    } catch {
      setError(
        'El fondo no permite la exportación desde el navegador. Configura CORS en Hetzner para este origen y vuelve a intentarlo.',
      )
    } finally {
      if (guide) guide.visible = true
      canvas.renderAll()
      setIsExporting(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Generador de mockups</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{preset.title}</h1>
        <p className="mt-3 text-muted-foreground">
          Sube tu diseño, ajústalo sobre la playera y descarga tu mockup en PNG. Tu archivo se procesa sólo en este navegador.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <section className="h-fit rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Personaliza tu mockup</h2>
          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-7 text-center transition-colors hover:bg-primary/10">
            <ImagePlus className="mb-3 h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Subir diseño</span>
            <span className="mt-1 text-xs text-muted-foreground">PNG, JPG o WEBP · máximo 8 MB</span>
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
              disabled={!isReady}
            />
          </label>

          <div className="mt-5 grid gap-2">
            <Button variant="outline" onClick={centerDesign} disabled={!hasDesign}>
              <RotateCcw /> Recentrar diseño
            </Button>
            <Button variant="outline" onClick={removeDesign} disabled={!hasDesign}>
              <Trash2 /> Quitar diseño
            </Button>
            <Button className="mt-2" onClick={download} disabled={!isReady || isExporting}>
              <Download /> {isExporting ? 'Preparando...' : 'Descargar PNG'}
            </Button>
          </div>

          {!canExport && (
            <p className="mt-4 text-xs leading-5 text-amber-700">
              La vista previa está lista; el bucket debe permitir CORS para descargar el fondo incluido.
            </p>
          )}
          {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
        </section>

        <section className="min-w-0 rounded-xl border bg-muted/30 p-3 shadow-sm sm:p-5">
          <div
            ref={containerRef}
            className="flex min-h-[420px] items-center justify-center overflow-auto rounded-lg bg-slate-200 p-3"
          >
            {!isReady && !error && <p className="absolute text-sm text-muted-foreground">Cargando mockup...</p>}
            <canvas ref={canvasElementRef} />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Arrastra, escala desde las esquinas y rota desde el control superior. La guía azul no aparece en la descarga.
          </p>
        </section>
      </div>
    </main>
  )
}
