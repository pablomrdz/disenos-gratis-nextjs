import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { DesignGrid } from '@/components/design-grid'
import { StickySidebar } from '@/components/sticky-sidebar'
import AdUnit from '@/components/AdUnit'
import { getDesigns, getCategories, getPopularCategories, getAllTags } from '@/lib/data'
import { getCategoryIcon } from '@/lib/utils'
import { WandSparkles } from 'lucide-react'
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
    getDesigns({ contentType: 'asset' }),
    getCategories(),
    getPopularCategories(6),
    getAllTags(),
  ])

  // Filtros de categoría para las pills
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

          {/* Category links: the same visual language as the home category explorer. */}
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Explora por categoría:</h2>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide sm:flex-wrap sm:justify-start sm:gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}/`}
                  className="group flex flex-none items-center gap-1.5 rounded-full border border-border/50 bg-card px-3 py-1.5 shadow-sm transition-all hover:bg-accent hover:shadow-md sm:px-4 sm:py-2"
                >
                  <span className="text-muted-foreground transition-colors group-hover:text-primary">
                    {getCategoryIcon(cat.name, 'h-3.5 w-3.5 sm:h-4 sm:w-4')}
                  </span>
                  <span className="text-xs font-medium text-foreground transition-colors group-hover:text-primary sm:text-sm">{cat.name}</span>
                </Link>
              ))}
              <Link
                href="/mockups/"
                className="group flex flex-none items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 shadow-sm transition-all hover:bg-primary/10 hover:shadow-md sm:px-4 sm:py-2"
              >
                <WandSparkles className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                <span className="text-xs font-medium text-foreground transition-colors group-hover:text-primary sm:text-sm">Mockups</span>
              </Link>
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
