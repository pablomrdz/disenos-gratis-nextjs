"use client"

import Image from 'next/image'
import { useState } from 'react'
import { Check, Clipboard, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { trackEvent } from '@/lib/analytics'
import { toast } from 'sonner'

interface ImageGalleryProps {
  images?: string[] | null
  designSlug?: string
}

export function ImageGallery({ images, designSlug }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isCopying, setIsCopying] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  if (!images || images.length === 0) return null;

  const handleCopyImage = async (url: string) => {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
      setCopySuccess(false)
      toast.error('Tu navegador no permite copiar imágenes directamente. Usa Descargar.')
      return
    }

    setIsCopying(true)
    setCopySuccess(false)

    try {
      const sourceUrl = url.startsWith('/')
        ? url
        : `/api/proxy-image?url=${encodeURIComponent(url)}`
      const response = await fetch(sourceUrl)
      if (!response.ok) throw new Error(`Image request failed: ${response.status}`)

      const sourceBlob = await response.blob()
      const pngBlob = await toPngBlob(sourceBlob)

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob }),
      ])

      trackEvent('copy_image', {
        design_slug: designSlug || 'unknown',
        source: 'image_gallery',
        image_type: 'png',
      })
      setCopySuccess(true)
    } catch (error) {
      console.error('[ImageGallery] Failed to copy image:', error)
      setCopySuccess(false)
      toast.error('No se pudo copiar la imagen. Si el problema continúa, usa Descargar.')
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <>
      <div className="relative mt-6 w-full max-w-full overflow-hidden">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Galería de Imágenes</h3>
        <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {images.map((url, idx) => (
            <img
               key={idx}
               src={url}
               alt={`Imagen de galería ${idx + 1}`}
              onClick={() => {
                setSelectedImage(url)
                setCopySuccess(false)
              }}
               className="h-48 sm:h-64 w-auto max-w-[85vw] shrink-0 snap-center rounded-2xl shadow-md border border-border/20 transition-transform hover:scale-[1.02] cursor-pointer object-contain bg-background"
               loading="lazy"
            />
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null)
            setCopySuccess(false)
          }
        }}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none [&>button]:text-white [&>button]:bg-black/50 [&>button]:rounded-full [&>button]:hover:bg-black/70">
          <DialogTitle className="sr-only">Vista previa de imagen</DialogTitle>
          {selectedImage && (
            <div className="relative w-full h-[85vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Vista previa ampliada"
                fill
                className="object-contain"
                sizes="90vw"
              />
              <button
                type="button"
                onClick={() => void handleCopyImage(selectedImage)}
                disabled={isCopying}
                className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-black/90 disabled:cursor-wait disabled:opacity-80"
                aria-live="polite"
              >
                {isCopying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : copySuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
                {isCopying ? 'Copiando…' : copySuccess ? 'Imagen copiada' : 'Copiar imagen'}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

async function toPngBlob(sourceBlob: Blob): Promise<Blob> {
  if (sourceBlob.type === 'image/png') return sourceBlob

  const bitmap = await createImageBitmap(sourceBlob)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
  bitmap.close()

  const pngBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  )

  if (!pngBlob) throw new Error('Unable to convert image to PNG')
  return pngBlob
}
