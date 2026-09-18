'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Download, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { DesignCard as DesignCardType } from '@/lib/types'
import { slugify } from '@/lib/utils'

interface DesignCardProps {
  design: DesignCardType
  variant?: 'asset' | 'blog'
}

export function DesignCard({ design, variant = 'asset' }: DesignCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  const isBlog = variant === 'blog'

  const imgSrc = imgError
    ? '/placeholder.svg'
    : (design.image_url || design.thumbnail_url || '/placeholder.svg')

  const rawCategory = design.category?.trim() || ''
  const mainCategory = rawCategory ? rawCategory.split(',')[0].trim() : ''
  const categoryLabel = mainCategory || (isBlog ? 'Blog' : 'General')

  const assetUrl = `/${slugify(mainCategory || 'general')}/${design.slug || design.id}`
  const cardUrl = isBlog ? `/blog/${design.slug || design.id}` : assetUrl

  const isTemplateCategory = !isBlog && slugify(design.category || '').includes('plantillas')
  const canEdit = !isBlog && Boolean(design.is_editable && design.editor_type)

  return (
    <div
      className="relative z-0 transition-transform duration-300 ease-out hover:-translate-y-1 hover:z-10 will-change-transform"
      style={{ isolation: 'isolate' }}
    >
      <Card
        className="group border-border/50 bg-card p-0 gap-0 flex flex-col h-full hover:border-primary/20 hover:shadow-2xl shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={cardUrl} className="block w-full">
          <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted rounded-t-xl">
            {canEdit && (
              <div className="absolute top-3 left-3 bg-[#50b5cb]/10 text-[#3ba4bc] border border-[#50b5cb]/20 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm backdrop-blur-md z-30 flex items-center gap-1">
                <span>✨</span> Editable Online
              </div>
            )}

            <Image
              src={imgSrc}
              alt={design.alt_text || design.title || (isBlog ? 'Artículo de Diseños Gratis' : 'Diseño gratis')}
              fill
              className={`${isTemplateCategory ? 'object-contain bg-white' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
              unoptimized={imgSrc.includes('supabase.co')}
            />

            <div
              className={`absolute inset-0 bg-black/5 transition-opacity duration-300 z-20 flex items-center justify-center pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <div
                className={`flex items-center gap-2 bg-white/95 text-primary px-5 py-2.5 rounded-full shadow-xl backdrop-blur-sm transform transition-all duration-300 ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
              >
                {isBlog ? (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Leer artículo</span>
                  </>
                ) : canEdit ? (
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
              <Link href={cardUrl}>
                <h3
                  className="line-clamp-1 text-xs font-bold text-foreground transition-colors group-hover/link:text-primary sm:text-[13px]"
                  dangerouslySetInnerHTML={{ __html: design.title || (isBlog ? 'Artículo' : 'Untitled Design') }}
                />
              </Link>
            </div>

            <div className="mt-1">
              {isBlog ? (
                <span className="truncate text-[8px] font-uppercase tracking-wider text-muted-foreground uppercase bg-muted/50 px-1.5 py-0.5 rounded min-w-0 inline-block">
                  {categoryLabel}
                </span>
              ) : (
                <Link
                  href={`/${slugify(mainCategory || 'general')}`}
                  className="relative z-20 truncate text-[8px] font-uppercase tracking-wider text-muted-foreground uppercase bg-muted/50 px-1.5 py-0.5 rounded transition-colors hover:bg-primary/10 hover:text-primary min-w-0 inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  {categoryLabel.replace('-', ' ')}
                </Link>
              )}
            </div>

            {design.excerpt && (
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                {design.excerpt}
              </p>
            )}
          </div>

          {isBlog ? (
            <div className="flex justify-end mt-auto pt-4">
              <Link href={cardUrl} className="relative z-10">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-full text-[10px] font-bold px-3 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Leer artículo
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1.5 mt-auto pt-4">
              <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground whitespace-nowrap shrink-0">
                <Download className="h-2 w-2" />
                {(design.downloads ?? 0).toLocaleString()}
              </span>

              <div className="relative z-10">
                <Link href={cardUrl}>
                  {canEdit ? (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
