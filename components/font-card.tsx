'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Download, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { DesignCard } from '@/lib/types'

import { slugify } from '@/lib/utils'
import { loadCustomFontFromSupabase } from '@/lib/font-loader'

interface FontCardProps {
  font: DesignCard
}

export function FontCard({ font }: FontCardProps) {
  const [previewText, setPreviewText] = useState('Texto de prueba')
  const [loadedFontFamily, setLoadedFontFamily] = useState<string | null>(null)

  console.log("🎴 GRID CARD - Item:", font.title, "-> Font Prop:", font.font_family);

  useEffect(() => {
    if (!font.font_family) return;

    let isMounted = true;
    const fontRef = font.font_family.replace(/['"]/g, "").trim();

    async function load() {
      try {
        const family = await loadCustomFontFromSupabase(fontRef);
        if (!family) return;

        await document.fonts.ready;
        if (isMounted) {
            const cleanName = family.replace(/['"]/g, "").replace(/\.[^/.]+$/, "").trim();
            setTimeout(() => {
                if (isMounted) setLoadedFontFamily(cleanName);
            }, 50);
        }
      } catch (err) {
        if (isMounted) setLoadedFontFamily('sans-serif');
      }
    }
    
    load();
    
    return () => { isMounted = false; };
  }, [font.font_family]);

  const mainCategory = (font.category || 'Tipografías').split(',')[0].trim()
  const siloUrl = `/${slugify(mainCategory)}/${font.slug || font.id}`

  const appliedFontFamily = loadedFontFamily ? `'${loadedFontFamily}', sans-serif` : 'sans-serif';

  return (
    <div className="relative z-0 transition-transform duration-300 ease-out hover:-translate-y-1 hover:z-10 will-change-transform" style={{ isolation: 'isolate' }}>
    <Card className="group border-border/50 p-0 gap-0 flex flex-col hover:border-primary/20 hover:shadow-2xl shadow-sm">
      {/* Main Image Preview (Visual appeal) */}
      <Link href={siloUrl} className="block w-full">
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted rounded-t-xl">
          <Image
            src={font.image_url || font.thumbnail_url || "/placeholder.svg"}
            alt={font.alt_text || font.title || "Diseño editable gratis"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Interactive Text Previewer */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="p-3 flex flex-col gap-2">
          <div 
            className="flex min-h-[60px] items-center justify-center rounded-md bg-background px-4 py-2 shadow-inner overflow-hidden"
            style={{ fontFamily: appliedFontFamily }}
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
              style={{ fontFamily: appliedFontFamily }}
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
    </div>
  )
}
