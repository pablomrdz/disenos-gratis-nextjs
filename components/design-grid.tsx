import { DesignCard } from '@/components/design-card'
import { GoogleAd } from '@/components/google-ad'
import type { Design } from '@/lib/types'

interface DesignGridProps {
  designs: Design[]
  showAds?: boolean
  adFrequency?: number
}

export function DesignGrid({
  designs,
  showAds = true,
  adFrequency = 8
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        if ('type' in item && item.type === 'ad') {
          return (
            <div key={item.id} className="sm:col-span-2">
              <GoogleAd
                adUnitName="in feed para listas"
                height={280}
              />
            </div>
          )
        }
        return <DesignCard key={item.id} design={item} />
      })}
    </div>
  )
}
