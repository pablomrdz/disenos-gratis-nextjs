import { cn } from '@/lib/utils'

interface AdPlaceholderProps {
    variant?: 'skyscraper' | 'horizontal' | 'square'
    className?: string
}

export function AdPlaceholder({ variant = 'horizontal', className }: AdPlaceholderProps) {
    const dimensions = {
        skyscraper: { width: '300px', height: '600px', label: '300 × 600' },
        horizontal: { width: '100%', height: '90px', label: '728 × 90' },
        square: { width: '100%', height: '250px', label: '300 × 250' },
    }

    const { width, height, label } = dimensions[variant]

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/30',
                className
            )}
            style={{ width, height, minHeight: height }}
        >
            <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground">Anuncio AdSense</p>
                <p className="mt-1 text-[10px] text-muted-foreground/60">{label}</p>
            </div>
        </div>
    )
}
