import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { DesignGrid } from '@/components/design-grid'
import { StickySidebar } from '@/components/sticky-sidebar'
import AdUnit from '@/components/AdUnit'
import { getDesigns, getCategories, getPopularCategories, getAllTags } from '@/lib/data'
import { cn } from '@/lib/utils'
import { LegacyQueryHandler } from './legacy-query-handler'

// ISR: Cachear en CDN por 24 horas
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Todos los Diseños y Plantillas | Diseños Gratis',
  description: 'Explora nuestra colección completa de plantillas, fuentes y recursos de diseño. Descargas gratuitas y premium disponibles.',
}

export default async function DesignsPage() {
  // Fetch paralelo de datos estáticos
  const [designs, categories, popularCategories, allTags] = await Promise.all([
    getDesigns({ excludeCategory: 'blog' }),
    getCategories(),
    getPopularCategories(6),
    getAllTags(),
  ])

  // Filtros de categoría para las pills
  const categoryFilters = [
    { name: 'Todos', slug: 'all' },
    ...categories.filter((c) => c.slug !== 'blog'),
  ]

  return (
    <>
      {/* Manejador de redirecciones heredadas en el cliente sin romper SSG */}
      <Suspense fallback={null}>
        <LegacyQueryHandler />
      </Suspense>

      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todos los Diseños
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explora nuestra colección completa de plantillas y recursos
          </p>

          {/* Category Filters (Pills) */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Filtrar por categoría:</h3>
            <div className="flex flex-wrap gap-2 pb-2">
              {categoryFilters.map((cat) => {
                const isActive = cat.slug === 'all'
                return (
                  <Link
                    key={cat.slug}
                    href={cat.slug === 'all' ? '/designs' : `/${cat.slug}`}
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
              </div>
              <DesignGrid designs={designs} showAds={true} adFrequency={8} columns={3} />
            </div>

            {/* Sidebar */}
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