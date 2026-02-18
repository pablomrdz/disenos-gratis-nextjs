import { Skeleton } from '@/components/ui/skeleton'
import { DesignGridSkeleton } from '@/components/design-card-skeleton'

export default function CategoryLoading() {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-10">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="mt-3 h-4 w-96 max-w-full" />
                </div>

                <div className="grid lg:grid-cols-[1fr_300px] gap-8">
                    {/* Main Content */}
                    <DesignGridSkeleton count={9} columns={3} />

                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block space-y-6">
                        <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
                            <Skeleton className="h-5 w-40" />
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full rounded-md" />
                            ))}
                        </div>
                        <Skeleton className="h-[600px] w-full rounded-xl" />
                    </aside>
                </div>
            </div>
        </section>
    )
}
