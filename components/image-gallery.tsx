import Image from 'next/image'

export function ImageGallery({ images }: { images?: string[] | null }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="relative mt-6 w-full max-w-full overflow-hidden">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Galería de Imágenes</h3>
      <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {images.map((url, idx) => (
          <div 
             key={idx} 
             className="relative aspect-[4/3] w-[80%] shrink-0 snap-center sm:w-[60%] md:w-[45%] overflow-hidden rounded-xl border border-border/50 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Image
              src={url}
              alt={`Imagen de galería ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 40vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
