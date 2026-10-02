import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { DesignGrid } from '@/components/design-grid'
import { StickySidebar } from '@/components/sticky-sidebar'
import {
  DESIGN_CARD_FIELDS,
  getPopularCategories,
  getRelatedTags,
  getTaxonomyBySlug,
} from '@/lib/data'
import {
  getAllAssetTags,
  getAssetTagNameBySlug,
  getDesignsByNormalizedTag,
} from '@/lib/tag-resolver'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Tag } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { RichText } from '@/components/rich-text'
import type { DesignCard } from '@/lib/types'

export const revalidate = 86400

/**
 * Formats were intentionally removed from tags during data cleanup. Historical
 * routes such as /tags/png/ still have internal links and SEO signals, so when
 * a semantic tag does not exist we resolve those routes from technical_type.
 */
const LEGACY_FORMAT_TAGS: Record<string, string[]> = {
  png: ['png'],
  jpg: ['jpg', 'jpeg'],
  jpeg: ['jpg', 'jpeg'],
  pdf: ['pdf'],
  ai: ['ai'],
  eps: ['eps'],
  svg: ['svg'],
  psd: ['psd'],
  cdr: ['cdr'],
  dxf: ['dxf'],
  dwg: ['dwg'],
  ttf: ['ttf', 'otf'],
  otf: ['otf', 'ttf'],
  studio3: ['studio3', 'studio 3'],
}

async function getDesignsByLegacyFormat(
  slug: string,
  limit: number = 100
): Promise<DesignCard[]> {
  const formats = LEGACY_FORMAT_TAGS[slug]
  if (!formats?.length) return []

  const supabase = createServerSupabaseClient()
  const orQuery = formats
    .map((format) => `technical_type.ilike.%${format}%`)
    .join(',')

  const { data, error } = await supabase
    .from('designs')
    .select(DESIGN_CARD_FIELDS)
    .or(orQuery)
    .eq('content_type', 'asset')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`Error fetching legacy format route ${slug}:`, error)
    return []
  }

  return (data || []) as DesignCard[]
}

export async function generateStaticParams() {
  try {
    const tags = await getAllAssetTags()
    if (!tags || !Array.isArray(tags)) return []

    return tags.map((tag: string) => ({
      slug: slugify(tag),
    }))
  } catch (error) {
    console.error('Error generating static params for tags:', error)
    return []
  }
}

interface TagPageProps {
  params: Promise<{ slug: string }>
}

function formatDisplayName(slug: string): string {
  const decoded = decodeURIComponent(slug)
  if (decoded === 'dia-del-amor-y-la-amistad') return 'Amor y Amistad'
  if (decoded === 'dia-de-las-madres') return 'Día de las Madres'
  if (decoded === 'dia-del-padre') return 'Día del Padre'
  if (decoded === 'cumpleanos') return 'Cumpleaños'
  if (decoded === 'png') return 'Imágenes PNG sin fondo'
  return decoded.replace(/-/g, ' ')
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedTag = decodeURIComponent(slug)
  const cleanSlug = slugify(decodedTag)
  const [taxonomy, storedTagName] = await Promise.all([
    getTaxonomyBySlug(cleanSlug, 'tag'),
    getAssetTagNameBySlug(cleanSlug),
  ])
  const displayName = storedTagName || formatDisplayName(decodedTag)
  const canonicalUrl = `https://disenosgratis.com/tags/${cleanSlug}`

  return {
    title: taxonomy?.seo_title || `${displayName} - Plantillas y Vectores Gratis`,
    description:
      taxonomy?.seo_description ||
      `Explora y descarga gratis diseños, vectores y plantillas etiquetados bajo "${displayName}". Alta resolución lista para estampar.`,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const decodedTag = decodeURIComponent(slug)
  const cleanSlug = slugify(decodedTag)

  // Keep a single canonical URL for every tag. Historical links may contain
  // uppercase letters, spaces, accents, or encoded characters; normalize them
  // before resolving the tag so they cannot create parallel or malformed paths.
  if (decodedTag !== cleanSlug) {
    permanentRedirect(`/tags/${cleanSlug}/`)
  }

  // Resolve semantic tags by their normalized URL slug instead of guessing the
  // exact stored capitalization/accents.
  const semantic = await getDesignsByNormalizedTag(cleanSlug, 100)
  const displayName = semantic.tagName || formatDisplayName(decodedTag)

  const [popularCategories, relatedTags, taxonomy] = await Promise.all([
    getPopularCategories(6),
    getRelatedTags(semantic.tagName || decodedTag, 8),
    getTaxonomyBySlug(cleanSlug, 'tag'),
  ])

  const taggedDesigns =
    semantic.designs.length > 0
      ? semantic.designs
      : await getDesignsByLegacyFormat(cleanSlug, 100)

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
            <main className="lg:col-span-3 min-w-0">
              <p className="mb-6 text-sm text-muted-foreground">
                Mostrando {taggedDesigns.length}{' '}
                {taggedDesigns.length === 1 ? 'resultado' : 'resultados'}
              </p>
              <DesignGrid designs={taggedDesigns} />

              {taxonomy?.content_bottom && (
                <section className="mt-12 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
                  <div className="prose prose-slate max-w-none">
                    <RichText content={taxonomy.content_bottom} />
                  </div>
                </section>
              )}
            </main>

            <aside className="hidden lg:block">
              <StickySidebar
                popularCategories={popularCategories}
                tags={relatedTags}
              />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}