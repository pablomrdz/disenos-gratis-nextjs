import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Search as SearchIcon } from 'lucide-react'
import { StickySidebar } from '@/components/sticky-sidebar'
import { getPopularCategories, getAllTags } from '@/lib/data'
import SearchClientContent from './search-client-content'

// ISR: Cachear el cascarón estático en la CDN por 24 horas
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Search Designs | Diseños Gratis',
  description: 'Search our collection of premium design templates, fonts, and resources',
}

export default async function SearchPage() {
  const [popularCategories, allTags] = await Promise.all([
    getPopularCategories(6),
    getAllTags(),
  ])

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Search Designs
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Find templates, fonts, and resources for your projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Column (Client Component envuelto en Suspense) */}
            <div className="lg:col-span-3 min-w-0">
              <Suspense
                fallback={
                  <div className="rounded-lg border border-dashed border-border p-12 text-center">
                    <SearchIcon className="mx-auto h-12 w-12 animate-spin text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">Cargando buscador...</p>
                  </div>
                }
              >
                <SearchClientContent />
              </Suspense>
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