import { Megaphone } from 'lucide-react'

export type AdFormat = 'hero' | 'sidebar' | 'inline' | '728x90' | '300x250' | '300x600' | 'responsive'

interface AdSlotProps {
  format?: AdFormat
  variant?: AdFormat // Para compatibilidad
  slotId?: string
  className?: string
}

export function AdSlot({ format, variant, slotId, className = '' }: AdSlotProps) {
  const activeFormat = format || variant || 'responsive'
  const baseStyles = "relative overflow-hidden rounded-lg border border-dashed border-border/50 bg-muted/30 flex items-center justify-center"
  
  const formatStyles: Record<string, string> = {
    hero: 'h-[200px] md:h-[280px] w-full',
    sidebar: 'h-[300px] md:h-[600px] w-full',
    inline: 'h-[150px] md:h-[200px] w-full',
    '728x90': 'w-[728px] h-[90px] max-w-full',
    '300x250': 'w-[300px] h-[250px]',
    '300x600': 'w-[300px] h-[600px]',
    responsive: 'w-full h-auto min-h-[100px]',
  }

  const dimensionText: Record<string, string> = {
    hero: '728x90 / 970x250',
    sidebar: '300x600 / 160x600',
    inline: '728x90 / 300x250',
    '728x90': '728x90',
    '300x250': '300x250',
    '300x600': '300x600',
    responsive: 'Responsive',
  }

  return (
    <div className={`${baseStyles} ${formatStyles[activeFormat] || ''} ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow-sm">
          <Megaphone className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            Publicidad
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            {dimensionText[activeFormat]} {slotId && `(${slotId})`}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <div className="text-6xl font-bold tracking-widest text-foreground">AD</div>
      </div>
    </div>
  )
}
