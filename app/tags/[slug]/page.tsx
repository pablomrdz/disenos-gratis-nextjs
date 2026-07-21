import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DesignGrid } from '@/components/design-grid'
import { StickySidebar } from '@/components/sticky-sidebar'
import { getDesignsByTag, getPopularCategories, getAllTags, getTaxonomyBySlug } from '@/lib/data'
import { Tag } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { RichText } from '@/components/rich-text'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

// Helper para formatear nombres de etiquetas en fallbacks
function formatDisplayName(slug: string): string {
  const decoded = decodeURIComponent(slug)
  if (decoded === 'dia-del-amor-y-la-amistad') return 'Amor y Amistad'
  if (decoded === 'dia-de-las-madres') return 'Día de las Madres'
  if (decoded === 'dia-del-padre') return 'Día del Padre'
  if (decoded === 'cumpleanos') return 'Cumpleaños'
  return decoded.replace(/-/g, ' ')
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedTag = decodeURIComponent(slug)
  const cleanSlug = slugify(decodedTag)
  const displayName = formatDisplayName(decodedTag)
  const taxonomy = await getTaxonomyBySlug(cleanSlug, 'tag')

  const canonicalUrl = `https://disenosgratis.com/tags/${cleanSlug}`

  return {
    title: taxonomy?.seo_title || `${displayName} - Plantillas y Vectores Gratis`,
    description: taxonomy?.seo_description || `Explora y descarga gratis diseños, vectores y plantillas etiquetados bajo "${displayName}". Alta resolución lista para estampar.`,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const decodedTag = decodeURIComponent(slug)
  const cleanSlug = slugify(decodedTag)
  const displayName = formatDisplayName(decodedTag)

  // Fetch resources in parallel
  const [taggedDesigns, popularCategories, allTags, taxonomy] = await Promise.all([
    getDesignsByTag(decodedTag, 100),
    getPopularCategories(6),
    getAllTags(),
    getTaxonomyBySlug(cleanSlug, 'tag')
  ])

  // 🦈 SANITIZACIÓN ANTI-SOFT-404:
  // Si la etiqueta no devuelve ningún recurso en Supabase, disparamos notFound() 
  // para forzar un código HTTP 404 real y activar app/not-found.tsx inmediatamente.
  if (!taggedDesigns || taggedDesigns.length === 0) {
    notFound()
  }

  return (
    <>
      <div className="bg-muted/30 py-12 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          {taxonomy ? (
            <>
              {!taxonomy.description && (
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl capitalize mb-4">
                  {taxonomy.name}
                </h1>
              )}
              {taxonomy.description && (
                <div className="prose prose-slate max-w-none text-left">
                  <RichText content={taxonomy.description} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Tag className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl capitalize">
                  {displayName}
                </h1>
              </div>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                Explora todos los recursos y diseños etiquetados bajo "{displayName}".
              </p>
            </>
          )}
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-3 min-w-0">
              <p className="mb-6 text-sm text-muted-foreground">
                Mostrando {taggedDesigns.length} {taggedDesigns.length === 1 ? 'resultado' : 'resultados'}
              </p>
              <DesignGrid designs={taggedDesigns} />
            </main>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <StickySidebar
                popularCategories={popularCategories}
                tags={allTags.slice(0, 20)}
              />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}