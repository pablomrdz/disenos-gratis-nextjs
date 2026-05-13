'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Download, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Design } from '@/lib/types'

import { slugify } from '@/lib/utils'

interface FontCardProps {
  font: Design
}

export function FontCard({ font }: FontCardProps) {
  const [previewText, setPreviewText] = useState('Texto de prueba')

  const mainCategory = (font.category || 'Tipografías').split(',')[0].trim()
  const siloUrl = `/${slugify(mainCategory)}/${font.slug || font.id}`

  return (
    <Card className="group overflow-hidden border-border/50 p-0 gap-0 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      {/* Main Image Preview (Visual appeal) */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Link href={siloUrl}>
          <Image
            src={font.image_url || font.thumbnail_url || "/placeholder.svg"}
            alt={font.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Interactive Text Previewer */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="p-3 flex flex-col gap-2">
          <div 
            className="flex min-h-[60px] items-center justify-center rounded-md bg-background px-4 py-2 shadow-inner overflow-hidden"
            style={{ fontFamily: font.font_family || 'sans-serif' }}
          >
            <span className="text-xl sm:text-2xl text-center break-words line-clamp-2">{previewText || 'Texto de prueba'}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Escribe para probar..."
              className="w-full rounded-md border border-border/50 bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              onClick={(e) => e.stopPropagation()}
            />
            <Type className="absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground opacity-50 pointer-events-none" />
          </div>
        </div>
      </div>

      <CardContent className="p-3 flex flex-col justify-between flex-1">
        <div>
          <Link href={siloUrl} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-sm text-foreground line-clamp-1">
              {font.title}
            </h3>
          </Link>
          <div className="mt-1">
            <Link
              href={`/${slugify(mainCategory)}`}
              className="relative z-20 truncate text-[9px] font-uppercase tracking-wider text-muted-foreground uppercase bg-muted/50 px-1.5 py-0.5 rounded transition-colors hover:bg-primary/10 hover:text-primary min-w-0 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              {mainCategory.replace('-', ' ')}
            </Link>
          </div>
          {font.excerpt && (
            <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
              {font.excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-border/50">
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground shrink-0">
            <Download className="h-3 w-3" />
            {(font.downloads || 0).toLocaleString()}
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
