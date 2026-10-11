import type { Metadata } from 'next'
import { DesignGrid } from '@/components/design-grid'
import AdUnit from '@/components/AdUnit'
import { RichText } from '@/components/rich-text'
import { StickySidebar } from '@/components/sticky-sidebar'
import { getAllTags, getDesigns, getPopularCategories, getTaxonomyBySlug } from '@/lib/data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Plantillas Editables Online Gratis | Diseños Gratis',
  description:
    'Crea, personaliza y descarga plantillas editables online gratis para cumpleaños, baby shower, lotería y otros proyectos creativos.',
  alternates: {
    canonical: '/plantillas/',
  },
  openGraph: {
    title: 'Plantillas Editables Online Gratis | Diseños Gratis',
    description:
      'Elige una plantilla, personalízala directamente en tu navegador y descarga tu diseño listo para usar.',
    url: '/plantillas/',
    locale: 'es_MX',
    type: 'website',
  },
}

export default async function PlantillasPage() {
  const [designs, taxonomy, popularCategories, allTags] = await Promise.all([
    getDesigns({ category: 'plantillas', contentType: 'asset', limit: 48 }),
    getTaxonomyBySlug('plantillas', 'category'),
    getPopularCategories(6),
    getAllTags(),
  ])

  return (
    <>
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {taxonomy?.description ? (
            <RichText
              content={taxonomy.description}
              className="prose-h1:mb-2 prose-h1:text-3xl prose-h1:leading-tight prose-p:mt-2 prose-p:max-w-3xl prose-p:text-base prose-p:leading-7 sm:prose-h1:text-4xl"
            />
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Plantillas editables online gratis
              </h1>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                Elige una plantilla, personaliza textos o imágenes directamente en tu navegador y descarga el resultado listo para usar.
              </p>
            </>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <main className="min-w-0 lg:col-span-3">
            <div className="mb-8 flex min-h-[250px] w-full justify-center overflow-hidden">
              <AdUnit
                slot="1352493197"
                format="fluid"
                layoutKey="-fb+5w+4e-db+86"
                style={{ display: 'block' }}
                className="w-full"
              />
            </div>

            <section aria-labelledby="plantillas-disponibles">
              <div className="mb-5">
                <h2 id="plantillas-disponibles" className="text-2xl font-bold tracking-tight text-foreground">
                  Plantillas disponibles
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Abre una plantilla para ver sus archivos y, cuando esté habilitado, personalízala con nuestro editor online.
                </p>
              </div>

              {designs.length > 0 ? (
                <DesignGrid designs={designs} columns={2} />
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                  <h2 className="text-lg font-medium">No hay plantillas disponibles por el momento</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Estamos preparando nuevas plantillas editables. Vuelve a consultar pronto.
                  </p>
                </div>
              )}
            </section>

            {taxonomy?.content_bottom && (
              <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
                <div className="prose prose-slate max-w-none">
                  <RichText content={taxonomy.content_bottom} />
                </div>
              </section>
            )}
          </main>

          <aside className="hidden lg:block">
            <StickySidebar popularCategories={popularCategories} tags={allTags.slice(0, 20)} />
          </aside>
        </div>
      </div>
    </>
  )
}
