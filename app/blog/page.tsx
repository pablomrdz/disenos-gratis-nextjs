import type { Metadata } from 'next'
import { Video } from 'lucide-react'
import { DesignCard } from '@/components/design-card'
import { StickySidebar } from '@/components/sticky-sidebar'
import AdUnit from '@/components/AdUnit'
import { getDesigns, getPopularCategories, getAllTags } from '@/lib/data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog de Diseño - Tutoriales y Recursos Gratis',
  description: 'Aprende a dominar herramientas de diseño y descarga los mejores recursos gratuitos.',
  alternates: {
    canonical: '/blog/',
  },
}

export default async function TutorialsPage() {
  const [blogPosts, popularCategories, allTags] = await Promise.all([
    getDesigns({ contentType: 'blog' }),
    getPopularCategories(6),
    getAllTags(),
  ])

  return (
    <>
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 sm:h-16 sm:w-16 sm:rounded-2xl">
              <Video className="h-6 w-6 text-red-500 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                Blog
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-lg">
                Artículos, tutoriales y recursos para mejorar tus diseños
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="min-w-0 lg:col-span-3">
              <div className="mb-8 min-h-[250px] w-full flex justify-center">
                <AdUnit
                  slot="1352493197"
                  format="fluid"
                  layoutKey="-fb+5w+4e-db+86"
                  style={{ display: 'block' }}
                  className="w-full"
                />
              </div>

              {blogPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {blogPosts.map((post) => (
                    <DesignCard key={post.id} design={post} variant="blog" />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    No hay artículos disponibles en este momento.
                  </p>
                </div>
              )}

              <div className="mt-8 min-h-[250px] w-full flex justify-center">
                <AdUnit
                  slot="1352493197"
                  format="fluid"
                  layoutKey="-fb+5w+4e-db+86"
                  style={{ display: 'block' }}
                  className="w-full"
                />
              </div>
            </div>

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
