import type { Metadata } from 'next'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { getDesigns, getCategories } from '@/lib/data'
import { Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Design Templates & Resources',
  description: 'Browse our complete collection of design templates, fonts, and resources. Free and premium downloads available.',
}

// Static filters for Type (can correspond to types in DB or hardcoded subsets)
const typeFilters = [
  { label: 'All Types', value: 'all' },
  { label: 'Canva', value: 'canva' },
  { label: 'CapCut', value: 'capcut' },
  { label: 'Fonts', value: 'font' },
  { label: 'Direct Download', value: 'internal' },
]

interface DesignsPageProps {
  searchParams: Promise<{ type?: string; vip?: string; category?: string; tag?: string }>
}

import { redirect } from 'next/navigation'

// ... (imports remain)

export default async function DesignsPage({ searchParams }: DesignsPageProps) {
  const { type, vip, category, tag } = await searchParams

  // Redirect legacy tag search to new tag page
  if (tag) {
    redirect(`/tags/${encodeURIComponent(tag)}`)
  }

  // Fetch designs with all active filters
  const designs = await getDesigns({
    type: type && type !== 'all' ? type : undefined,
    isVip: vip === 'true' ? true : undefined,
    category: category && category !== 'all' ? category : undefined,
    excludeCategory: 'blog',
  })

  // Fetch Categories for the pills
  const categories = await getCategories();

  // Combine static "All" with fetched categories
  const categoryFilters = [
    { name: 'Todos', slug: 'all' },
    ...categories
  ]

  const allDesigns = await getDesigns({ limit: 10, excludeCategory: 'blog' })
  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All Designs
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse our complete collection of templates and resources
          </p>

          {/* Type Filters (Static) - Removed as requested */}
          {/* 
            User requested to remove "All Types", "Canva", "Capcut" pills.
            Only keeping the dynamic Category filters below.
          */}

          {/* Category Filters (Dynamic Pills) */}
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Filtrar por categoría:</h3>
            <div className="flex flex-wrap gap-2 pb-2">
              {categoryFilters.map((cat) => {
                const isActive = category === cat.slug || (!category && cat.slug === 'all');
                return (
                  <Link
                    key={cat.slug}
                    href={cat.slug === 'all'
                      ? `/designs${type ? `?type=${type}` : ''}${vip ? `${type ? '&' : '?'}vip=${vip}` : ''}`
                      : `/designs?category=${cat.slug}${type ? `&type=${type}` : ''}${vip ? `&vip=${vip}` : ''}`}
                    scroll={false}
                  >
                    <div
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border cursor-pointer select-none whitespace-nowrap",
                        isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {cat.name}
                    </div>
                  </Link>
                )
              })}
            </div>
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
              <div className="mb-4 text-sm text-muted-foreground flex items-center justify-between">
                <span>Showing {designs.length} designs</span>
                {(category || type || vip) && (
                  <Link href="/designs" className="text-xs text-blue-600 hover:underline">Clear all filters</Link>
                )}
              </div>
              {designs.length > 0 ? (
                <DesignGrid designs={designs} showAds={true} adFrequency={8} />
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    No designs found with the selected filters.
                  </p>
                  <Link href="/designs">
                    <Button variant="link" className="mt-2">View all designs</Button>
                  </Link>
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
