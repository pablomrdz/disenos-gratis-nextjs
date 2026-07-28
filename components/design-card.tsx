'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { DesignCard as DesignCardType } from '@/lib/types'
import { slugify, cn } from '@/lib/utils'

interface DesignCardProps {
  design: DesignCardType
}

export function DesignCard({ design }: DesignCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Robust image src with error fallback
  const imgSrc = imgError
    ? '/placeholder.svg'
    : (design.image_url || design.thumbnail_url || '/placeholder.svg')

  // Get main category safely
  const mainCategory = (design.category || 'general').split(',')[0].trim()
  const siloUrl = `/${slugify(mainCategory)}/${design.slug || design.id}`

  // Check if this design belongs to plantillas category
  const isPlantilla = slugify(design.category || '').includes('plantillas')

  return (
    <div className="relative z-0 transition-transform duration-300 ease-out hover:-translate-y-1 hover:z-10 will-change-transform" style={{ isolation: 'isolate' }}>
    <Card
      className="group border-border/50 bg-card p-0 gap-0 flex flex-col h-full hover:border-primary/20 hover:shadow-2xl shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={siloUrl} className="block w-full">
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted rounded-t-xl">
          {isPlantilla && (
            <div className="absolute top-3 left-3 bg-[#50b5cb]/10 text-[#3ba4bc] border border-[#50b5cb]/20 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm backdrop-blur-md z-30 flex items-center gap-1">
              <span>✨</span> Editable Online
            </div>
          )}
          <Image
            src={imgSrc}
            alt={design.alt_text || design.title || "Diseño editable gratis"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
            unoptimized={imgSrc.includes('supabase.co')}
          />

          {/* Overlay on hover - Elegant & Minimalist */}
          <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 z-20 flex items-center justify-center pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`flex items-center gap-2 bg-white/95 text-primary px-5 py-2.5 rounded-full shadow-xl backdrop-blur-sm transform transition-all duration-300 ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}>
              {isPlantilla ? (
                <>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Personalizar</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Descargar</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-2 relative flex flex-col justify-between min-h-[90px] flex-1">
        <div>
          <div className="group/link block relative z-10">
            {/* Title needs to decode entities like &#8211; */}
            <Link href={siloUrl}>
              <h3
                className="line-clamp-1 text-xs font-bold text-foreground transition-colors group-hover/link:text-primary sm:text-[13px]"
                dangerouslySetInnerHTML={{ __html: design.title || 'Untitled Design' }}
              />
            </Link>
          </div>
          <div className="mt-1">
            <Link
              href={`/${slugify(mainCategory)}`}
              className="relative z-20 truncate text-[8px] font-uppercase tracking-wider text-muted-foreground uppercase bg-muted/50 px-1.5 py-0.5 rounded transition-colors hover:bg-primary/10 hover:text-primary min-w-0 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              {mainCategory.replace('-', ' ')}
            </Link>
          </div>
          {design.excerpt && (
            <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
              {design.excerpt}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-1.5 mt-auto pt-4">
          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground whitespace-nowrap shrink-0">
            <Download className="h-2 w-2" />
            {(design.downloads ?? 0).toLocaleString()}
          </span>
          <div className="relative z-10">
            <Link href={siloUrl}>
              {isPlantilla ? (
                <button className="bg-gradient-to-r from-[#50b5cb] to-blue-600 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:from-[#40a4b9] hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer flex items-center justify-center">
                  Personalizar Ahora ⚡
                </button>
              ) : (
                <Button 
                  size="sm" 
                  className="h-7 rounded-full border-none text-[10px] font-bold px-4 transition-all duration-300 bg-primary/10 text-primary hover:bg-primary hover:text-white"
                >
                  Descargar
                </Button>
              )}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
