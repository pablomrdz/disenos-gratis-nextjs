"use client"

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function ImageGallery({ images }: { images?: string[] | null }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative mt-6 w-full max-w-full overflow-hidden">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Galería de Imágenes</h3>
        <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {images.map((url, idx) => (
            <div 
               key={idx} 
               onClick={() => setSelectedImage(url)}
               className="relative flex items-center justify-center aspect-video w-[80%] shrink-0 snap-center sm:w-[60%] md:w-[45%] overflow-hidden rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900/50 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Image
                src={url}
                alt={`Imagen de galería ${idx + 1}`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 40vw"
              />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
