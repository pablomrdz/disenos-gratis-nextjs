'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Design } from '@/lib/types'
import { slugify, cn } from '@/lib/utils'

interface DesignCardProps {
  design: Design
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

  return (
    <Card
      className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Link href={siloUrl}>
          <Image
            src={imgSrc}
            alt={design.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
            unoptimized={imgSrc.includes('supabase.co')}
          />
        </Link>

        {/* Overlay on hover - Compact & Simplified */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300 z-20 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center text-white text-[10px] font-bold uppercase tracking-wider">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Descargar
          </div>
          <Button size="sm" variant="secondary" className="h-8 w-8 rounded-full p-0 pointer-events-auto shadow-sm" asChild onClick={(e) => e.stopPropagation()}>
            <Link href={siloUrl}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-2 relative flex flex-col justify-between min-h-[90px]">
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
        </div>
        <div className="flex items-center justify-between gap-1.5 mt-auto pt-1">
          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground whitespace-nowrap shrink-0">
            <Download className="h-2 w-2" />
            {(design.downloads ?? 0).toLocaleString()}
          </span>
          <div className="relative z-10">
            <Link href={siloUrl}>
              <Button size="sm" className="h-7 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white border-none text-[10px] font-bold px-4 transition-all duration-300">
                Descargar
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
