import React from 'react'
import { DesignCard } from '@/components/design-card'
import { FontCard } from '@/components/font-card'
import { AdUnit } from '@/components/ad-unit'
import { normalizeText, cn } from '@/lib/utils'
import type { DesignCard as DesignCardData } from '@/lib/types'

interface DesignGridProps {
  designs: DesignCardData[]
  showAds?: boolean
  adFrequency?: number
  columns?: 2 | 3 | 4
}

export function DesignGrid({
  designs,
  showAds = false,
  adFrequency = 8,
  columns = 4
}: DesignGridProps) {
  // Detect if grid mainly contains fonts
  const fontCount = designs.filter(d => {
    const normalizedCat = normalizeText(d.category || '');
    return d.type === 'font' || normalizedCat.includes('tipografia') || normalizedCat.includes('fuente');
  }).length;
  const isFontGrid = designs.length > 0 && fontCount > designs.length / 2;

  return (
    <div className={cn(
      "grid gap-6 isolate",
      isFontGrid 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
        : cn(
            "grid-cols-1 sm:grid-cols-2",
            columns === 2 
              ? "lg:grid-cols-2" 
              : columns === 3 
                ? "lg:grid-cols-3" 
                : "lg:grid-cols-4"
          )
    )}>
      {designs.map((item, index) => {
        // Detect if it's a typography design
        const normalizedCat = normalizeText(item.category || '');
        const isFont = item.type === 'font' ||
          normalizedCat.includes('tipografia') ||
          normalizedCat.includes('fuente');

        const cardComponent = isFont ? (
          <FontCard key={item.id} font={item} />
        ) : (
          <DesignCard key={item.id} design={item} />
        );

        // Inyectar anuncio si showAds es true y alcanzamos la frecuencia configurada
        const shouldShowAd = showAds && (index + 1) % adFrequency === 0;

        if (shouldShowAd) {
          return (
            <React.Fragment key={`item-ad-group-${item.id}`}>
              {cardComponent}
              <div className="col-span-1 flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-muted/20 p-2">
                <AdUnit
                  slot="9549519747"
                  format="auto"
                  style={{ display: "block", width: "100%" }}
                  className="w-full"
                />
              </div>
            </React.Fragment>
          );
        }

        return cardComponent;
      })}
    </div>
  )
}