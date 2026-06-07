import type { Metadata } from 'next'
import { DesignGrid } from '@/components/design-grid'
import { StickySidebar } from '@/components/sticky-sidebar'
import AdUnit from '@/components/AdUnit'
import { getDesigns, getCategories, getPopularCategories, getAllTags } from '@/lib/data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn, slugify } from '@/lib/utils'
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

  // Combine static "All" with fetched categories, exclude 'blog'
  const categoryFilters = [
    { name: 'Todos', slug: 'all' },
    ...categories.filter(c => c.slug !== 'blog')
  ]

  // Fetch data for StickySidebar
  const [popularCategories, allTags] = await Promise.all([
    getPopularCategories(6),
    getAllTags(),
  ])

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
                      ? '/designs'
                      : `/${cat.slug}`}
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Design Grid */}
            <div className="lg:col-span-3 min-w-0">
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

            {/* Sidebar - StickySidebar unificada */}
            <aside className="hidden lg:block">
              <StickySidebar
                popularCategories={popularCategories}
                tags={allTags.slice(0, 20)}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
