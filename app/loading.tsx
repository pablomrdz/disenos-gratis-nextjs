import { Skeleton } from '@/components/ui/skeleton'
import { DesignGridSkeleton } from '@/components/design-card-skeleton'

export default function HomeLoading() {
    return (
        <>
            {/* Hero Skeleton */}
            <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/50 to-background py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <Skeleton className="mx-auto h-10 w-96 max-w-full rounded-lg" />
                    <Skeleton className="mx-auto mt-4 h-5 w-72 max-w-full" />
                    <Skeleton className="mx-auto mt-6 h-12 w-80 max-w-full rounded-full" />
                </div>
            </section>

            {/* Categories Skeleton */}
            <section className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-3 overflow-hidden">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Design Grid Skeleton */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="mt-2 h-4 w-80" />
                    </div>
                    <DesignGridSkeleton count={8} columns={4} />
                </div>
            </section>
        </>
    )
}
