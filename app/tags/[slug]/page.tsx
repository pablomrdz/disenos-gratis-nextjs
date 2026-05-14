import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { getDesignsByTag, getDesigns, getPopularCategories, getTaxonomyBySlug } from '@/lib/data'
import { Tag } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { RichText } from '@/components/rich-text'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

interface TagPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const { slug } = await params
    const decodedTag = decodeURIComponent(slug)
    const cleanSlug = slugify(decodedTag)
    const taxonomy = await getTaxonomyBySlug(cleanSlug, 'tag')

    return {
        title: taxonomy?.seo_title || `Diseños con la etiqueta: ${decodedTag}`,
        description: taxonomy?.seo_description || `Explora nuestra colección de diseños etiquetados con "${decodedTag}". Descarga vectores, plantillas y recursos gráficos gratis.`,
    }
}

export default async function TagPage({ params }: TagPageProps) {
    const { slug } = await params
    const decodedTag = decodeURIComponent(slug)

    // Format display name from slug
    let displayName = decodedTag.replace(/-/g, ' ');

    // Special mappings for better UX
    if (decodedTag === 'dia-del-amor-y-la-amistad') displayName = 'Amor y Amistad';
    if (decodedTag === 'dia-de-las-madres') displayName = 'Día de las Madres';
    if (decodedTag === 'dia-del-padre') displayName = 'Día del Padre';
    if (decodedTag === 'cumpleanos') displayName = 'Cumpleaños';

    // Fetch designs for this tag
    const taggedDesigns = await getDesignsByTag(decodedTag, 100)

    // Fetch popular designs for sidebar (reuse logic or fetch general popular)
    const allDesigns = await getDesigns({ limit: 10 })
    const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

    // Fetch taxonomy for this tag
    const cleanSlug = slugify(decodedTag)
    const taxonomy = await getTaxonomyBySlug(cleanSlug, 'tag')

    if (taggedDesigns.length === 0) {
        // Logic for empty tag or 404? 
        // For now we show the page but with empty state or similar
        // Or we can just render it.
    }

    return (
        <>
            <div className="bg-muted/30 py-12 border-b border-border/40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Tag className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl capitalize">
                            {taxonomy?.name || displayName}
                        </h1>
                    </div>
                    
                    {taxonomy?.description ? (
                        <div className="mt-6 prose prose-slate max-w-none text-left">
                            <RichText content={taxonomy.description} />
                        </div>
                    ) : (
                        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                            Explora todos los recursos y diseños etiquetados bajo "{displayName}".
                        </p>
                    )}
                </div>
            </div>

            <div className="py-8 bg-slate-50 border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <AdSlot variant="inline" className="bg-white shadow-sm border border-slate-200 rounded-lg" />
                </div>
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
                        {/* Main Content */}
                        <main>
                            {taggedDesigns.length > 0 ? (
                                <>
                                    <p className="mb-6 text-sm text-muted-foreground">Mostrando {taggedDesigns.length} resultados</p>
                                    <DesignGrid designs={taggedDesigns} showAds={true} adFrequency={6} />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
                                    <div className="rounded-full bg-muted p-4">
                                        <Tag className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold">No se encontraron diseños</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        No hay diseños etiquetados con "{decodedTag}" en este momento.
                                    </p>
                                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                                        <p className="w-full text-sm font-medium text-muted-foreground mb-2">O intenta explorar estas categorías populares:</p>
                                        {['Sublimación', 'DTF', 'Corte Láser', 'Vectores', 'Tipografías'].map((cat) => (
                                            <Link
                                                key={cat}
                                                href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                                                className="rounded-full bg-white px-4 py-2 text-sm font-medium border border-slate-200 hover:border-primary hover:text-primary transition-colors"
                                            >
                                                {cat}
                                            </Link>
                                        ))}
                                    </div>
                                    <Link href="/designs" className="mt-8 text-sm font-medium text-primary hover:underline">
                                        Ver todos los diseños
                                    </Link>
                                </div>
                            )}
                        </main>

                        {/* Sidebar */}
                        <aside className="hidden lg:block">
                            <Sidebar popularDesigns={popularDesigns} />
                        </aside>
                    </div>
                </div>
            </div>
        </>
    )
}
