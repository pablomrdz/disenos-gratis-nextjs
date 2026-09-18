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
        <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-card">
            <div className="border-b border-border/50 bg-muted/40 px-4 py-2">
                <h3 className="text-xs font-semibold tracking-wide text-foreground sm:text-sm">
                    Información Técnica
                </h3>
            </div>

            <ul className="divide-y divide-border/30 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {INFO_ROWS.map(({ icon: Icon, label, getVal }) => (
                    <li key={label} className="flex min-w-0 items-center gap-2.5 px-3 py-2.5 sm:px-3 sm:py-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-3.5 w-3.5" />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[9px] font-medium uppercase leading-3 tracking-wider text-muted-foreground sm:text-[10px]">
                                {label}
                            </p>
                            <p className="mt-0.5 text-xs font-medium leading-4 text-foreground sm:text-[13px]">
                                {getVal(design)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
