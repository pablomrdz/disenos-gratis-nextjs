import Link from 'next/link'
import { Tag, Home, ChevronRight, Search } from 'lucide-react'
import { getAllTags } from '@/lib/data'
import { CategorySection } from '@/components/category-section'
import { slugify } from '@/lib/utils'
import type { Metadata } from 'next'

//export const dynamic = 'force-dynamic'
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Etiquetas y temas de diseños gratis',
  description:
    'Explora diseños, plantillas y recursos gráficos gratis organizados por temas, formatos y etiquetas.',
  alternates: {
    canonical: '/tags/',
  },
}

export default async function TagsPage() {
    const tags = await getAllTags()

    const POPULAR_CATEGORIES = [
        { name: 'Sublimación', slug: 'sublimacion' },
        { name: 'Vectores', slug: 'vectores' },
        { name: 'Plantillas', slug: 'plantillas' },
        { name: 'DTF', slug: 'dtf' },
        { name: 'Tipografías', slug: 'tipografias' },
        { name: 'Corte Láser', slug: 'corte-laser' },
    ]

    // Format tags for display (handle hyphenated slugs if they came from WP)
        const formattedTags = tags.map(tag => ({
        original: tag,
        display: tag.replace(/-/g, ' '),
        slug: slugify(tag),
        }))

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/designs" className="hover:text-primary transition-colors">
                            Diseños
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">Etiquetas</span>
                    </nav>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-primary/10 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                        <Tag className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Explorar todas las etiquetas
                    </h1>
                    <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto sm:mt-4 sm:text-xl">
                        Descubre recursos gráficos gratis organizados por etiquetas y temas específicos. Encuentra exactamente lo que buscas para tus proyectos.
                    </p>
                </div>
            </div>

            {/* Tags Grid */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
                {tags.length > 0 ? (
                    <div className="columns-2 gap-3 sm:gap-6 lg:columns-3 xl:columns-4">
                        {formattedTags.map(({ original, display, slug }) => (
                            <div key={original} className="break-inside-avoid mb-3 sm:mb-4">
                                <Link
                                    href={`/tags/${slug}`}
                                    className="group flex min-h-14 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-primary hover:shadow-md sm:p-4"
                                >
                                    <span className="text-sm font-semibold text-slate-700 capitalize group-hover:text-primary">
                                        {display}
                                    </span>
                                    <div className="hidden rounded-full bg-slate-50 p-2 group-hover:bg-primary/10 transition-colors sm:block">
                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <div className="rounded-full bg-slate-100 p-4 mb-4">
                            <Search className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No se encontraron etiquetas</h3>
                        <p className="mt-2 text-slate-500 max-w-sm">
                            Parece que no hay etiquetas disponibles en este momento. Intenta explorar nuestras categorías principales.
                        </p>
                        <Link
                            href="/designs"
                            className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            Ir a Diseños
                        </Link>
                    </div>
                )}
            </div>

      {/* Categories section */}
      <CategorySection />


        </div>
    )
}
