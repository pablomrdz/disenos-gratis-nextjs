import type { Metadata } from 'next'
import Link from 'next/link'
import { DesignGrid } from '@/components/design-grid'
import AdUnit from '@/components/AdUnit'
import { RichText } from '@/components/rich-text'
import { StickySidebar } from '@/components/sticky-sidebar'
import { getAllTags, getDesigns, getPopularCategories, getTaxonomyBySlug } from '@/lib/data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Diseños para DTF Gratis | PNG y Semitonos de Alta Calidad',
  description:
    'Descarga diseños DTF gratis en PNG de alta resolución, semitonos y recursos listos para imprimir en playeras y otros proyectos textiles.',
  alternates: {
    canonical: '/dtf/',
    languages: {
      es: '/dtf/',
      en: '/en/dtf/',
      'x-default': '/dtf/',
    },
  },
  openGraph: {
    title: 'Diseños para DTF Gratis | PNG y Semitonos de Alta Calidad',
    description:
      'Diseños DTF gratis en PNG, semitonos y recursos listos para imprimir.',
    url: '/dtf/',
    locale: 'es_MX',
    type: 'website',
  },
}

export default async function DtfPage() {
  const [designs, taxonomy, popularCategories, allTags] = await Promise.all([
    getDesigns({ category: 'dtf', contentType: 'asset', limit: 48 }),
    getTaxonomyBySlug('dtf', 'category'),
    getPopularCategories(6),
    getAllTags(),
  ])

  return (
    <>
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {taxonomy?.description ? (
            <RichText content={taxonomy.description} />
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Diseños DTF gratis listos para imprimir
              </h1>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                Imágenes, plantillas y diseños DTF en PNG de alta resolución para descargar gratis y usar en playeras y otros proyectos de impresión.
              </p>
            </>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="min-w-0 lg:col-span-3">
            <div className="mb-8 flex min-h-[250px] w-full justify-center overflow-hidden">
              <AdUnit
                slot="1352493197"
                format="fluid"
                layoutKey="-fb+5w+4e-db+86"
                style={{ display: 'block' }}
                className="w-full"
              />
            </div>

            <section className="py-6 sm:py-8">
              {designs.length > 0 ? (
                <DesignGrid designs={designs} columns={4} />
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                  <h2 className="text-lg font-medium">No hay diseños DTF disponibles por el momento</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Explora las herramientas DTF mientras añadimos nuevos recursos.
                  </p>
                </div>
              )}
            </section>

            {taxonomy?.content_bottom && (
              <section className="mb-8 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
                <div className="prose prose-slate max-w-none">
                  <RichText content={taxonomy.content_bottom} />
                </div>
              </section>
            )}

            <section className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight">Herramientas DTF gratuitas</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                También puedes consultar nuestras nuevas herramientas para configuración de prensa y tamaños de transferencia DTF.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/en/tools/dtf-press-settings/" className="font-semibold text-primary hover:underline">
                  DTF Heat Press Settings →
                </Link>
                <Link href="/en/tools/dtf-size-guide/" className="font-semibold text-primary hover:underline">
                  DTF Size Guide →
                </Link>
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <StickySidebar popularCategories={popularCategories} tags={allTags.slice(0, 20)} />
          </aside>
        </div>
      </div>
    </>
  )
}
