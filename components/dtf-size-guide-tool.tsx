'use client'

import { useMemo, useState } from 'react'
import { Ruler, Shirt } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type GarmentKey = 'onesie' | 'toddler' | 'youth' | 'adult-s' | 'adult-ml' | 'adult-xl' | 'adult-plus'
type PlacementKey = 'front' | 'back' | 'left-chest'

const GARMENTS = {
  onesie: { label: 'Onesie / Infant', front: '3.5–5 in', back: '3.5–5 in', collar: '1–1.5 in' },
  toddler: { label: 'Toddler', front: '5–7 in', back: '5–7 in', collar: '1.5–2 in' },
  youth: { label: 'Youth', front: '7–9 in', back: '7–9 in', collar: '2–2.5 in' },
  'adult-s': { label: 'Adult XS–S', front: '9–10 in', back: '10–11 in', collar: '2.5–3 in' },
  'adult-ml': { label: 'Adult M–L', front: '10–11 in', back: '11–12 in', collar: '2.5–3 in' },
  'adult-xl': { label: 'Adult XL–2XL', front: '11–12 in', back: '12–13 in', collar: '3–3.5 in' },
  'adult-plus': { label: 'Adult 3XL–4XL', front: '12–13.5 in', back: '13–14 in', collar: '3–3.5 in' },
} satisfies Record<GarmentKey, { label: string; front: string; back: string; collar: string }>

export function DtfSizeGuideTool() {
  const [garment, setGarment] = useState<GarmentKey>('adult-ml')
  const [placement, setPlacement] = useState<PlacementKey>('front')
  const result = useMemo(() => GARMENTS[garment], [garment])
  const recommendedWidth = placement === 'left-chest' ? '3–4 in' : placement === 'back' ? result.back : result.front

  const track = (nextGarment: GarmentKey, nextPlacement: PlacementKey) => {
    trackEvent('tool_interaction', { tool_name: 'dtf_size_guide', garment: nextGarment, placement: nextPlacement })
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Garment size</span>
          <select
            value={garment}
            onChange={(event) => {
              const value = event.target.value as GarmentKey
              setGarment(value)
              track(value, placement)
            }}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          >
            {Object.entries(GARMENTS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Placement</span>
          <select
            value={placement}
            onChange={(event) => {
              const value = event.target.value as PlacementKey
              setPlacement(value)
              track(garment, value)
            }}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          >
            <option value="front">Front center</option>
            <option value="back">Full back</option>
            <option value="left-chest">Left chest</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-primary">
              <Ruler className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.08em]">Recommended width</span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{recommendedWidth}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/25 p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shirt className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.08em]">From collar</span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{placement === 'left-chest' ? '2.5–3.5 in' : result.collar}</p>
          </div>
        </div>
        <ShirtDiagram placement={placement} />
      </div>

      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        These are practical starting ranges. Artwork shape, shirt cut and customer preference can change the ideal width, so measure the printable area before production.
      </p>
    </div>
  )
}

function ShirtDiagram({ placement }: { placement: PlacementKey }) {
  const placementClass = placement === 'left-chest'
    ? 'left-[34%] top-[34%] h-[17%] w-[18%]'
    : placement === 'back'
      ? 'left-[27%] top-[28%] h-[42%] w-[46%]'
      : 'left-[27%] top-[31%] h-[36%] w-[46%]'

  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-border/60 bg-slate-50 p-5">
      <div className="relative h-[230px] w-[210px]">
        <svg viewBox="0 0 210 230" className="h-full w-full" role="img" aria-label="T-shirt placement preview">
          <path d="M66 23 92 12h26l26 11 38 25-21 35-22-12v145H71V71L49 83 28 48z" fill="white" stroke="currentColor" strokeWidth="3" className="text-slate-400" />
          <path d="M92 13c1 16 25 16 26 0" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400" />
        </svg>
        <div className={`absolute rounded-md border-2 border-dashed border-primary bg-primary/15 ${placementClass}`} />
      </div>
    </div>
  )
}
