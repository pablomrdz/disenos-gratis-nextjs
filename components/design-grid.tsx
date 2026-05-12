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
  adFrequency = 8,
  columns = 4
}: DesignGridProps) {
  const items: (Design | { type: 'ad'; id: string })[] = []

  designs.forEach((design, index) => {
    items.push(design)

    // Insert ad after every adFrequency items
    if (showAds && (index + 1) % adFrequency === 0 && index < designs.length - 1) {
      items.push({ type: 'ad', id: `ad-feed-${index}` })
    }
  })

  return (
    <div className={cn(
      "grid gap-6 grid-cols-2",
      columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
    )}>
      {items.map((item) => {
        if ('type' in item && item.type === 'ad') {
          return (
            <div key={item.id} className="sm:col-span-2">
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
