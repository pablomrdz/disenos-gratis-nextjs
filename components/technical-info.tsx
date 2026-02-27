import { FileType, Monitor, Scale } from 'lucide-react'
import type { Design } from '@/lib/types'

interface TechnicalInfoProps {
    design: Design
}

const INFO_ROWS = [
    {
        icon: FileType,
        label: 'Tipo de archivo',
        getVal: (d: Design) => d.technical_type || 'Archivo de diseño',
    },
    {
        icon: Monitor,
        label: 'Software recomendado',
        getVal: (d: Design) => d.software_recommended || 'Cualquier editor',
    },
    {
        icon: Scale,
        label: 'Licencia',
        getVal: () => 'Gratis (Uso comercial con atribución)',
    },
] as const

export function TechnicalInfo({ design }: TechnicalInfoProps) {
    return (
        <div className="mt-6 rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="border-b border-border/50 bg-muted/40 px-5 py-3">
                <h3 className="text-sm font-semibold text-foreground tracking-wide">
                    Información Técnica
                </h3>
            </div>
            <ul className="divide-y divide-border/30">
                {INFO_ROWS.map(({ icon: Icon, label, getVal }) => (
                    <li key={label} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                {label}
                            </p>
                            <p className="text-sm font-medium text-foreground truncate">
                                {getVal(design)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
