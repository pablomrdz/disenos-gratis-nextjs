import Link from 'next/link'
import { Tag, Home, ChevronRight, Search } from 'lucide-react'
import { getAllTags } from '@/lib/data'

export const dynamic = 'force-dynamic'

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
        slug: tag.replace(/\s+/g, '-').toLowerCase()
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
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                        <Tag className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Explorar todas las etiquetas
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
                        Descubre recursos gráficos gratis organizados por etiquetas y temas específicos. Encuentra exactamente lo que buscas para tus proyectos.
                    </p>
                </div>
            </div>

            {/* Tags Grid */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {tags.length > 0 ? (
                    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                        {formattedTags.map(({ original, display, slug }) => (
                            <div key={original} className="break-inside-avoid mb-4">
                                <Link
                                    href={`/tags/${slug}`}
                                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md"
                                >
                                    <span className="text-sm font-semibold text-slate-700 capitalize group-hover:text-primary">
                                        {display}
                                    </span>
                                    <div className="rounded-full bg-slate-50 p-2 group-hover:bg-primary/10 transition-colors">
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

            {/* Secondary Categories Call to Action */}
            <div className="bg-slate-900 py-16 text-white text-center">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-8">¿Prefieres buscar por categoría?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {POPULAR_CATEGORIES.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/${cat.slug}`}
                                className="rounded-full bg-white/10 px-6 py-2 text-sm font-bold border border-white/20 hover:bg-white hover:text-slate-900 transition-all"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
