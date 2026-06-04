import type { Metadata } from 'next'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdUnit } from '@/components/AdUnit'
import { getDesigns, getCategories } from '@/lib/data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { redirect } from 'next/navigation'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Todos los Diseños y Plantillas',
  description: 'Explora nuestra colección completa de plantillas, fuentes y recursos de diseño. Descargas gratuitas y premium disponibles.',
}

interface DesignsPageProps {
  searchParams: Promise<{ type?: string; vip?: string; category?: string; tag?: string }>
}

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
  const popularDesigns = [...allDesigns].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 5)

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todos los Diseños
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explora nuestra colección completa de plantillas y recursos
          </p>

          {/* Category Filters (Dynamic Pills) */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Filtrar por categoría:</h3>
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[90px] flex justify-center">
          <AdUnit
            slot="9549519747"
            format="auto"
            style={{ display: "block" }}
            className="w-full"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
            {/* Design Grid */}
            <div className="min-w-0">
              <div className="mb-4 text-sm text-muted-foreground flex items-center justify-between">
                <span>Mostrando {designs.length} diseños</span>
                {(category || type || vip) && (
                  <Link href="/designs" className="text-xs text-blue-600 hover:underline">Limpiar filtros</Link>
                )}
              </div>
              {designs.length > 0 ? (
                <DesignGrid designs={designs} showAds={true} adFrequency={8} columns={3} />
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    No se encontraron diseños con los filtros seleccionados.
                  </p>
                  <Link href="/designs">
                    <Button variant="link" className="mt-2">Ver todos los diseños</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar - Sticky */}
            <aside className="hidden lg:block relative">
              <div className="sticky top-24">
                <Sidebar popularDesigns={popularDesigns} />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
