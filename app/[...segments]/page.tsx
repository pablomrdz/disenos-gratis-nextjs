import { Suspense, Fragment } from 'react'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import {
  Download,
  ExternalLink,
  Calendar,
  Tag,
  ArrowLeft,
  ChevronRight,
  Type,
Play
} from 'lucide-react'

// Components
import { Badge } from '@/components/ui/badge'
import AdUnit from '@/components/AdUnit'

import { DesignGrid } from '@/components/design-grid'
import { DesignGridSkeleton } from '@/components/design-card-skeleton'
import { JsonLd } from '@/components/json-ld'
import { StickySidebar } from '@/components/sticky-sidebar'
import { FontPreviewInteractive } from '@/components/font-preview-interactive'
import { TechnicalInfo } from '@/components/technical-info'
import { ImageGallery } from '@/components/image-gallery'
import { RelatedSearches } from '@/components/related-searches'
import { RichText } from '@/components/rich-text'

// Utils and Lib
import { getDesignBySlug, getDesigns, getTutorials, getRelatedAssetsFromRpc, getPopularCategories, getAllTags, getPrimaryCategory, ALLOWED_SLUGS, getTaxonomyBySlug } from '@/lib/data'
import { createServerSupabaseClient } from '@/lib/supabase'
import { detectContentType, extractDownloadLink } from '@/lib/content-utils'
import { cn, slugify, normalizeText, getCategoryIcon, getCategoryColor } from '@/lib/utils'
import type { Design } from '@/lib/types'

import { DownloadSection } from './download-section'

export const revalidate = 3600

interface DynamicPageProps {
  params: Promise<{ segments: string[] }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { segments } = await params
  if (!segments || segments.length === 0) {
    return { title: 'Page Not Found' }
  }

  // --- Caso 1: CATEGORÍA ---
  if (segments.length === 1) {
    const slug = decodeURIComponent(segments[0])
    const cleanSlug = slugify(slug)
    const taxonomy = await getTaxonomyBySlug(cleanSlug, 'category')

    const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const canonicalUrl = `https://disenosgratis.com/${slug}`
    
    return {
      title: taxonomy?.seo_title || `${categoryName} - Categoría | Diseños Gratis`,
      description: taxonomy?.seo_description || `Explora nuestra mejor colección de diseños para ${categoryName}. Descargas gratuitas.`,
      alternates: {
        canonical: canonicalUrl,
      },
    }
  }

  // --- Caso 2: DISEÑO ---
  const slug = decodeURIComponent(segments[segments.length - 1])
  const design = await getDesignBySlug(slug)

  if (!design) {
    return { title: 'Design Not Found' }
  }

  // Ensure canonical URL uses clean slugified segments (no accents)
  const cleanSegments = segments.map(s => slugify(decodeURIComponent(s)))
  const canonicalUrl = `https://disenosgratis.com/${cleanSegments.join('/')}`
  
  const title = design.title || 'Untitled Design'
  const rawDescription = design.description || 'Descarga gratis este recurso gráfico de alta calidad'
  const description = rawDescription.replace(/<[^>]*>/g, '').slice(0, 160)
  const tags = Array.isArray(design.tags) ? design.tags : []
  const ogImage = design.image_url || design.thumbnail_url || ''

  return {
    title,
    description,
    keywords: tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Diseños Gratis',
      images: ogImage ? [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      }] : [],
      type: 'article',
      locale: 'es_MX',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export async function generateStaticParams() {
  const designs = await getDesigns({ limit: 100 })
  const designParams = designs.filter(d => Boolean(d.slug)).map((design) => {
    const primaryCategory = getPrimaryCategory(design.category)
    return {
      segments: [primaryCategory, design.slug],
    }
  })

  const categoryParams = ALLOWED_SLUGS.filter(slug => slug !== 'blog').map((slug) => ({
    segments: [slug]
  }))

  return [...categoryParams, ...designParams]
}

// Subcomponente de Data Fetching para Listado de Categoría
async function CategoryContent({ slug }: { slug: string }) {
  const supabase = createServerSupabaseClient()
  const { data: allDesigns, error } = await supabase
    .from('designs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error || !allDesigns) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p>Error loading designs.</p>
      </div>
    )
  }

  const normalize = (str: string) => decodeURIComponent(str || '').toLowerCase().replace(/-/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  const targetSlug = normalize(slug)
  
  const designs = (allDesigns as Design[]).filter(d => {
    const cat = normalize(d.category)
    return cat.includes(targetSlug)
  })

  if (designs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h2 className="text-xl font-semibold">No se encontraron diseños</h2>
        <p className="mt-2 text-muted-foreground">No hemos encontrado diseños para esta categoría todavía ({slug}).</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="min-h-[250px] w-full flex justify-center">
        <AdUnit
          slot="1352493197"
          format="fluid"
          layoutKey="-fb+5w+4e-db+86"
          style={{ display: "block" }}
          className="w-full"
        />
      </div>
      <DesignGrid designs={designs} showAds={true} adFrequency={6} columns={slugify(slug).includes('plantillas') ? 2 : 4} />
      <div className="min-h-[250px] w-full flex justify-center">
        <AdUnit
          slot="1352493197"
          format="fluid"
          layoutKey="-fb+5w+4e-db+86"
          style={{ display: "block" }}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default async function DynamicRoutePage({ params }: DynamicPageProps) {
  const { segments } = await params
  
  if (!segments || segments.length === 0) {
    notFound()
  }

  // ==========================================
  // VISTA 1: CATEGORÍA (segments.length === 1)
  // ==========================================
  if (segments.length === 1) {
    const rawSlug = segments[0]
    const decodedSlug = decodeURIComponent(rawSlug)

    // Check if the URL encoded form doesn't match the clean slug we want internally
    const cleanSlug = slugify(decodedSlug)
    if (rawSlug !== cleanSlug && decodeURIComponent(rawSlug) !== cleanSlug) {
      // Redirect accented category URLs to clean versions (e.g. sublimación → sublimacion)
      permanentRedirect(`/${cleanSlug}`)
    }

    const [popularCategories, allTags] = await Promise.all([
      getPopularCategories(6),
      getAllTags(),
    ])

    const categoryName = decodedSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const taxonomy = await getTaxonomyBySlug(cleanSlug, 'category')

    return (
      <>
        <section className="border-b border-border/40 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {taxonomy ? (
              <div>
                {!taxonomy.description && (
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {taxonomy.name}
                  </h1>
                )}
                {taxonomy.description && (
                  <div className="prose prose-slate max-w-none">
                    <RichText content={taxonomy.description} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${getCategoryColor(decodedSlug)}`}>
                  {getCategoryIcon(decodedSlug)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {categoryName}
                  </h1>
                  <p className="mt-1 text-lg text-muted-foreground">
                    Explora nuestra colección de diseños para {categoryName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 min-w-0">
              <Suspense fallback={<DesignGridSkeleton />}>
                <CategoryContent slug={decodedSlug} />
              </Suspense>
            </div>

            <aside className="hidden lg:block">
              <StickySidebar
                popularCategories={popularCategories}
                tags={allTags.slice(0, 20)}
              />
            </aside>
          </div>
        </div>
      </>
    )
  }

  // ==========================================
  // VISTA 2: DISEÑO FINAL (segments.length > 1)
  // ==========================================
  const slug = decodeURIComponent(segments[segments.length - 1])
  const categoryPath = segments.slice(0, -1).map(s => decodeURIComponent(s))

  // Fetch the data
  const [design, allDesigns, tutorials, popularCategories] = await Promise.all([
    getDesignBySlug(slug),
    getDesigns({ limit: 20 }),
    getTutorials({ limit: 3 }),
    getPopularCategories(6)
  ])

  // Retorna nulo/404 inmediatamente si no existe, evadiendo loops
  if (!design) {
    notFound()
  }

  const title = design.title || 'Untitled Design'
  const description = design.description || 'No description available'
  const rawCategory: string = design.category || 'general'
  
  // FIX: Validar comparando siempre versiones estrictamente slugified (sin acentos)
  const primaryCategoryClean = slugify(getPrimaryCategory(rawCategory))
  
  // Safety: never redirect if we can't determine a valid category
  if (primaryCategoryClean && primaryCategoryClean !== 'uncategorized') {
    if (categoryPath.length > 0) {
      const firstSegmentClean = slugify(categoryPath[0])
      
      if (primaryCategoryClean !== firstSegmentClean) {
         permanentRedirect(`/${primaryCategoryClean}/${slug}`)
      }
    } else {
      permanentRedirect(`/${primaryCategoryClean}/${slug}`)
    }
  }

  const tags = Array.isArray(design.tags) ? design.tags : []
  const downloads = design.downloads ?? 0
  const designType = design.type || 'internal'

  const createdAt = design.created_at ? new Date(design.created_at) : new Date()

  const normalizedCat = normalizeText(rawCategory);
  
  // Validar si probar fuentes
  const isFont = design.technical_type === 'tipografia' || design.technical_type === 'font' ||
    normalizedCat.includes('tipografia') || normalizedCat.includes('fuente');

  const contentType = detectContentType(design)
  const isBlog = contentType === 'blog'

  const externalLink = extractDownloadLink(description)
  const finalDownloadUrl = externalLink || design.download_url || design.external_url

  // RPC Call for topical related assets
  let relatedDesigns = await getRelatedAssetsFromRpc(design.id, rawCategory, 4)

  if (relatedDesigns.length === 0) {
    relatedDesigns = allDesigns
      .filter((d) => getPrimaryCategory(d.category) === primaryCategoryClean && d.id !== design.id)
      .slice(0, 4)
  }



  return (
    <>
      <JsonLd type="product" data={design} />

      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Inicio
            </Link>
            
            {categoryPath.map((pathSegment, index) => (
              <Fragment key={index}>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <Link
                  href={index === 0 ? `/${slugify(pathSegment)}` : `/${categoryPath.slice(0, index + 1).map(s => slugify(s)).join('/')}`}
                  className="capitalize text-muted-foreground transition-colors hover:text-foreground"
                >
                  {pathSegment.replace(/-/g, ' ')}
                </Link>
              </Fragment>
            ))}

            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <span className="line-clamp-1 font-medium text-foreground">
              {title}
            </span>
          </nav>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            <div className={cn(
              "col-span-12 lg:col-span-8 xl:col-span-9",
              isBlog && "max-w-3xl mx-auto lg:mx-0"
            )}>
              <Link
                href={`/${slugify(categoryPath[0] || primaryCategoryClean)}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a {(categoryPath[0] || primaryCategoryClean).replace(/-/g, ' ')}
              </Link>

              <div className="mb-6">
                <h1
                  className={cn(
                    "text-balance font-bold text-foreground",
                    isBlog ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl lg:text-4xl"
                  )}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link href={`/${slugify(categoryPath[0] || primaryCategoryClean)}`} className="transition-opacity hover:opacity-80">
                    <Badge variant="outline" className="bg-transparent capitalize cursor-pointer">
                      {(categoryPath[0] || primaryCategoryClean).replace('-', ' ')}
                    </Badge>
                  </Link>
                  {!isBlog && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Download className="h-4 w-4" />
                      {downloads.toLocaleString()} descargas
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {createdAt.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
                  <div className={cn(
                    "relative",
                    isBlog ? "aspect-[16/9]" : "aspect-[16/9] sm:aspect-[4/3]"
                  )}>
                    <Image
                      src={design.image_url || design.thumbnail_url || "/placeholder.svg"}
                      alt={design.alt_text || title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                    {/* Badges removed — Phase 1: all content is free */}
                  </div>
                </div>

                <ImageGallery images={design.gallery_urls} />

                {isFont && (
                  <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-6 sm:p-8">
                    {design.font_family ? (
                      <>
                        <h3 className="mb-4 text-sm font-medium text-primary flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Probador de texto en vivo
                        </h3>
                        <FontPreviewInteractive
                          isLarge={false}
                          className="w-full"
                          fontFamilyName={design.font_family}
                          initialText={title.includes('Halloween') ? 'Trick or Treat - Noche de Brujas' : undefined}
                        />
                        <p className="mt-4 text-[10px] text-muted-foreground italic">
                          Nota: Esta es una vista previa interactiva. Descarga la tipografía para usarla en tus proyectos.
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <h3 className="mb-2 text-sm font-semibold text-primary flex items-center justify-center gap-2">
                          <Type className="h-4 w-4" />
                          Vista previa no disponible
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Este recurso es un <strong>pack de múltiples fuentes</strong>.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Descarga el archivo completo para ver e instalar todas las tipografías incluidas.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="min-h-[250px] w-full flex justify-center overflow-hidden my-6">
                <AdUnit
                  slot="9549519747"
                  format="auto"
                  style={{ display: "block" }}
                  className="w-full"
                />
              </div>

              {!isBlog && (
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <DownloadSection design={design} isVip={false} />
                </div>
              )}

              {!isBlog && (
                <TechnicalInfo design={design} />
              )}

              <div className={cn(
                "mt-6",
                isBlog ? "text-lg leading-relaxed text-foreground/90" : "text-muted-foreground leading-relaxed"
              )}>
                <h2 className="sr-only">Descripción</h2>

                <div className="min-h-[250px] w-full flex justify-center overflow-hidden my-6">
                  <AdUnit
                    slot="9549519747"
                    format="auto"
                    style={{ display: "block" }}
                    className="w-full"
                  />
                </div>

                {/* WordPress migrated content (SEO) */}
                {design.content && design.content.trim().length > 0 && (
                  <div className="border-t border-border/40 pt-6">
                    <RichText content={design.content} />
                  </div>
                )}

                {/* Fallback: original description via Markdown */}
                {(!design.content || design.content.trim().length === 0) && (
                  <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none prose-a:text-primary prose-a:font-semibold hover:prose-a:underline">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {design.description || ''}
                    </ReactMarkdown>
                  </div>
                )}

                <div className="min-h-[250px] w-full flex justify-center overflow-hidden my-6">
                  <AdUnit
                    slot="9549519747"
                    format="auto"
                    style={{ display: "block" }}
                    className="w-full"
                  />
                </div>
                
                <RelatedSearches keywords={design.related_keywords} />
              </div>

              {relatedDesigns.length > 0 && (
                <div className="mt-10 border-t border-border/40 pt-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">También te puede gustar</h2>
                    <Link
                      href={`/${slugify(categoryPath[0] || primaryCategoryClean)}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Ver todos
                    </Link>
                  </div>
                  <div className="mt-8">
                    <DesignGrid designs={relatedDesigns} showAds={false} />
                  </div>
                </div>
              )}
            </div>

            <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
              <StickySidebar
                popularCategories={popularCategories}
                tags={tags}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
