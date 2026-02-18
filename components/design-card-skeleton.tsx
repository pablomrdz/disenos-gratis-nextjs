import { Skeleton } from '@/components/ui/skeleton'

export function DesignCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
            <Skeleton className="aspect-square w-full" />
            <div className="p-2.5 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16 rounded-full" />
                    <Skeleton className="h-3 w-10" />
                </div>
            </div>
        </div>
    )
}

interface DesignGridSkeletonProps {
    count?: number
    columns?: 2 | 3 | 4
}

export function DesignGridSkeleton({ count = 9, columns = 3 }: DesignGridSkeletonProps) {
    const gridClass = columns === 4
        ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : columns === 2
            ? 'grid gap-6 sm:grid-cols-2'
            : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'

    return (
        <div className={gridClass}>
            {Array.from({ length: count }).map((_, i) => (
                <DesignCardSkeleton key={i} />
            ))}
        </div>
    )
}
