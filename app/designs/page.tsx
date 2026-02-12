import type { Metadata } from 'next'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { getDesigns } from '@/lib/data'
import { Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Design Templates & Resources',
  description: 'Browse our complete collection of design templates, fonts, and resources. Free and premium downloads available.',
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Canva', value: 'canva' },
  { label: 'CapCut', value: 'capcut' },
  { label: 'Fonts', value: 'font' },
  { label: 'Direct Download', value: 'internal' },
]

interface DesignsPageProps {
  searchParams: Promise<{ type?: string; vip?: string }>
}

export default async function DesignsPage({ searchParams }: DesignsPageProps) {
  const { type, vip } = await searchParams

  const designs = await getDesigns({
    type: type && type !== 'all' ? type : undefined,
    isVip: vip === 'true' ? true : undefined,
    excludeCategory: 'blog',
  })

  const allDesigns = await getDesigns({ limit: 10, excludeCategory: 'blog' })
  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All Designs
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse our complete collection of templates and resources
          </p>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filters.map((filter) => (
              <Link
                key={filter.value}
                href={filter.value === 'all' ? '/designs' : `/designs?type=${filter.value}`}
              >
                <Badge
                  variant={type === filter.value || (!type && filter.value === 'all') ? 'default' : 'outline'}
                  className="cursor-pointer bg-transparent transition-colors hover:bg-primary/10"
                >
                  {filter.label}
                </Badge>
              </Link>
            ))}
            <span className="mx-2 h-4 w-px bg-border" />
            <Link href={vip === 'true' ? '/designs' : '/designs?vip=true'}>
              <Badge
                variant={vip === 'true' ? 'default' : 'outline'}
                className="cursor-pointer bg-transparent transition-colors hover:bg-amber-500/10"
              >
                VIP Only
              </Badge>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Ad */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdSlot variant="hero" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Design Grid */}
            <div>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {designs.length} designs
              </div>
              {designs.length > 0 ? (
                <DesignGrid designs={designs} showAds={true} adFrequency={8} />
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    No designs found with the selected filters.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <Sidebar popularDesigns={popularDesigns} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
