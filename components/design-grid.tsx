import { DesignCard } from '@/components/design-card'
import { FontCard } from '@/components/font-card'
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
  showAds = false, // Kept for backwards compatibility but ignored
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
      {designs.map((item) => {
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
