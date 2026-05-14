import { DesignCard } from '@/components/design-card'
import { FontCard } from '@/components/font-card'
import { AdBanner } from '@/components/ad-banner'
import { normalizeText, cn } from '@/lib/utils'
import type { Design } from '@/lib/types'

interface DesignGridProps {
  designs: Design[]
  showAds?: boolean
  adFrequency?: number
  columns?: 3 | 4
}

export function DesignGrid({
  designs,
  showAds = true,
  adFrequency = 8, // kept for backward compatibility if needed, but we'll override logic
  columns = 4
}: DesignGridProps) {
  const items: (Design | { type: 'ad'; id: string; isMobile?: boolean; isBoth?: boolean })[] = []

  designs.forEach((design, index) => {
    items.push(design)

    if (showAds) {
      // Anuncio exclusivo para móvil cada 4 (oculto en desktop)
      if ((index + 1) % 4 === 0 && index < designs.length - 1 && (index + 1) % 8 !== 0) {
        items.push({ type: 'ad', id: `ad-mobile-${index}`, isMobile: true })
      }
      // Anuncio para desktop y móvil cada 8
      if ((index + 1) % 8 === 0 && index < designs.length - 1) {
        items.push({ type: 'ad', id: `ad-both-${index}`, isBoth: true })
      }
    }
  })

  // Detect if grid mainly contains fonts
  const fontCount = designs.filter(d => {
    const normalizedCat = normalizeText(d.category || '');
    return d.type === 'font' || normalizedCat.includes('tipografia') || normalizedCat.includes('fuente');
  }).length;
  const isFontGrid = designs.length > 0 && fontCount > designs.length / 2;

  return (
    <div className={cn(
      "grid gap-6",
      isFontGrid 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
        : cn("grid-cols-1 sm:grid-cols-2", columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")
    )}>
      {items.map((item) => {
        if ('type' in item && item.type === 'ad') {
          const adClasses = item.isMobile ? "col-span-full block sm:hidden" : "col-span-full"
          return (
            <div key={item.id} className={adClasses}>
              <AdBanner
                slot="in feed para listas"
                minHeight={280}
              />
            </div>
          )
        }

        // Detect if it's a typography design
        const normalizedCat = normalizeText(item.category || '');
        const isFont = item.type === 'font' ||
          normalizedCat.includes('tipografia') ||
          normalizedCat.includes('fuente');

        if (isFont) {
          return <FontCard key={item.id} font={item} />
        }

        return <DesignCard key={item.id} design={item} />
      })}
    </div>
  )
}
