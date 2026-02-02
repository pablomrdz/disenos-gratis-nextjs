import { Megaphone } from 'lucide-react'

interface AdSlotProps {
  variant: 'hero' | 'sidebar' | 'inline'
  className?: string
}

export function AdSlot({ variant, className = '' }: AdSlotProps) {
  const baseStyles = "relative overflow-hidden rounded-lg border border-dashed border-border/50 bg-muted/30"
  
  const variantStyles = {
    hero: 'h-[200px] md:h-[280px]',
    sidebar: 'h-[300px] md:h-[600px]',
    inline: 'h-[150px] md:h-[200px]',
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Megaphone className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Advertisement
          </p>
          <p className="text-xs text-muted-foreground/70">
            {variant === 'hero' && '728x90 / 970x250'}
            {variant === 'sidebar' && '300x600 / 160x600'}
            {variant === 'inline' && '728x90 / 300x250'}
          </p>
        </div>
        {/* Ad placement code would go here */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="text-6xl font-bold tracking-widest text-foreground">AD</div>
        </div>
      </div>
    </div>
  )
}
