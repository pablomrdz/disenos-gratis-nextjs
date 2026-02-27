import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Download,
  ExternalLink,
  Crown,
  Calendar,
  Tag,
  ArrowLeft,
  ChevronRight,
  Type,
  Play
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GoogleAd } from '@/components/google-ad'
import { AdPlaceholder } from '@/components/ad-placeholder'
import { DesignGrid } from '@/components/design-grid'
import { JsonLd } from '@/components/json-ld'
import { StickySidebar } from '@/components/sticky-sidebar'
import { FontPreviewInteractive } from '@/components/font-preview-interactive'
import { TechnicalInfo } from '@/components/technical-info'
import { getDesignBySlug, getDesigns, getTutorials, getRelatedDesignsByTags, getPopularCategories, getPrimaryCategory } from '@/lib/data'
import { detectContentType, extractDownloadLink, splitContentForAd } from '@/lib/content-utils'
import { DownloadSection } from './download-section'
import { cn, slugify, normalizeText } from '@/lib/utils'

// Force SSR for SEO
// ISR: Static with 1 hour revalidation
export const revalidate = 3600

interface DesignPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DesignPageProps): Promise<Metadata> {
  const { slug } = await params
  const design = await getDesignBySlug(slug)

  if (!design) {
    return { title: 'Design Not Found' }
  }

  const title = design.title || 'Untitled Design'
  const rawDescription = design.description || 'Descarga gratis este recurso gráfico de alta calidad'
  const description = rawDescription.replace(/<[^>]*>/g, '').slice(0, 160)
  const tags = Array.isArray(design.tags) ? design.tags : []
  const ogImage = design.image_url || design.thumbnail_url || ''
  const canonicalUrl = `https://disenosgratis.com/designs/${slug}`

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

export default async function DesignPage({ params }: DesignPageProps) {
  const { slug } = await params
  const [design, allDesigns, tutorials, popularCategories] = await Promise.all([
    getDesignBySlug(slug),
    getDesigns({ limit: 20 }),
    getTutorials({ limit: 3 }),
    getPopularCategories(6)
  ])

  if (!design) {
    notFound()
  }

  // Safe field access with fallbacks
  const title = design.title || 'Untitled Design'
  const description = design.description || 'No description available'
  const rawCategory = design.category || 'general'
  const category = getPrimaryCategory(rawCategory)
  const tags = Array.isArray(design.tags) ? design.tags : []
  const downloads = design.downloads ?? 0
  const designType = design.type || 'internal'
  const isVip = Boolean(design.premium_url) || design.is_vip
  const createdAt = design.created_at ? new Date(design.created_at) : new Date()

  // Detect if it's a typography design
  const normalizedCat = normalizeText(rawCategory);
  const isFont = designType === 'font' ||
    normalizedCat.includes('tipografia') ||
    normalizedCat.includes('fuente');

  // Detect content type
  const contentType = detectContentType(design)
  const isBlog = contentType === 'blog'

  // Extract external download link if exists
  const externalLink = extractDownloadLink(description)
  const finalDownloadUrl = externalLink || design.download_url || design.external_url

  // Split content for ad insertion
  const { before: descBefore, after: descAfter } = splitContentForAd(description)

  // Related designs - try tag-based first, then fall back to category-based
  let relatedDesigns = await getRelatedDesignsByTags(design.id, tags, 4)

  // If no tag-based matches found, fall back to category-based
  if (relatedDesigns.length === 0) {
    relatedDesigns = allDesigns
      .filter((d) => d.category === category && d.id !== design.id)
      .slice(0, 4)
  }

  const getTypeLabel = () => {
    switch (designType) {
      case 'canva':
        return 'Plantilla de Canva'
      case 'capcut':
        return 'Plantilla de CapCut'
      case 'font':
        return 'Tipografía Gratis'
      default:
        return 'Descarga Directa'
    }
  }

  const getTypeColor = () => {
    switch (designType) {
      case 'canva':
        return 'bg-[#00C4CC]/10 text-[#00C4CC] border-[#00C4CC]/30'
      case 'capcut':
        return 'bg-[#FF0050]/10 text-[#FF0050] border-[#FF0050]/30'
      case 'font':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
    }
  }

  // Get primary tag for breadcrumb
  const primaryTag = tags.length > 0 ? tags[0] : null

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd type="product" data={design} />

      {/* Breadcrumb - SEO Navigation */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <Link
              href={`/category/${slugify(category)}`}
              className="capitalize text-muted-foreground transition-colors hover:text-foreground"
            >
              {category.replace(/-/g, ' ')}
            </Link>
            {primaryTag && (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <Link
                  href={`/tags/${encodeURIComponent(primaryTag)}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {primaryTag}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <span className="line-clamp-1 font-medium text-foreground">
              {title}
            </span>
          </nav>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Main Column (8 or 9 columns) */}
            <div className={cn(
              "col-span-12 lg:col-span-8 xl:col-span-9",
              isBlog && "max-w-3xl mx-auto lg:mx-0"
            )}>
              <Link
                href="/designs"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a diseños
              </Link>

              {/* Design Preview */}
              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
                  <div className={cn(
                    "relative",
                    isBlog ? "aspect-[16/9]" : "aspect-[4/3] sm:aspect-video"
                  )}>
                    <Image
                      src={design.image_url || design.thumbnail_url || "/placeholder.svg"}
                      alt={design.alt_text || title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                    {isVip && (
                      <div className="absolute left-4 top-4">
                        <Badge className="gap-1.5 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-white shadow-lg">
                          <Crown className="h-3.5 w-3.5" />
                          Contenido VIP
                        </Badge>
                      </div>
                    )}
                    <div className="absolute right-4 top-4">
                      <Badge className={`border ${getTypeColor()}`}>
                        {getTypeLabel()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Interactive Preview for Fonts (Extra tool) */}
                {isFont && (
                  <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-6 sm:p-8">
                    <h3 className="mb-4 text-sm font-medium text-primary flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Probador de texto (Simulación)
                    </h3>
                    <FontPreviewInteractive
                      isLarge={false}
                      className="w-full"
                      initialText={title.includes('Halloween') ? 'Trick or Treat - Noche de Brujas' : undefined}
                    />
                    <p className="mt-4 text-[10px] text-muted-foreground italic">
                      Nota: Esta es una vista previa del diseño. La tipografía real se obtiene al descargar el archivo.
                    </p>
                  </div>
                )}
              </div>

              {/* Header Info */}
              <div className="mt-8">
                <h1
                  className={cn(
                    "text-balance font-bold text-foreground",
                    isBlog ? "text-3xl sm:text-4xl lg:text-5xl font-serif" : "text-2xl sm:text-3xl lg:text-4xl"
                  )}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
                <GoogleAd adUnitName="despúes de cada h1" height={90} className="mt-4" />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link href={`/category/${slugify(category)}`} className="transition-opacity hover:opacity-80">
                    <Badge variant="outline" className="bg-transparent capitalize cursor-pointer">
                      {category.replace('-', ' ')}
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

              {/* Call to Action for Resources */}
              {!isBlog && (
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <DownloadSection design={design} isVip={isVip} />
                </div>
              )}

              {/* Technical Information Block */}
              {!isBlog && (
                <TechnicalInfo design={design} />
              )}

              {/* Description Content */}
              <div className={cn(
                "mt-10",
                isBlog ? "font-serif text-lg leading-relaxed text-foreground/90" : "text-muted-foreground leading-relaxed"
              )}>
                <h2 className="sr-only">Descripción</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {descBefore.split('\n').map((paragraph, index) => (
                    <p key={`before-${index}`} className="mb-4">{paragraph}</p>
                  ))}

                  {/* Internal Ad placeholder */}
                  {descAfter && (
                    <div className="my-8 flex justify-center">
                      <AdPlaceholder variant="horizontal" />
                    </div>
                  )}

                  {descAfter && descAfter.split('\n').map((paragraph, index) => (
                    <p key={`after-${index}`} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Related Designs */}
              {relatedDesigns.length > 0 && (
                <div className="mt-16 border-t border-border/40 pt-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">También te puede gustar</h2>
                    <Link
                      href={`/category/${slugify(category)}`}
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

            {/* Sidebar (4 or 3 columns) */}
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

function Button({ asChild, size, className, children }: any) {
  const Comp = asChild ? 'span' : 'button'
  return (
    <Comp className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      size === 'lg' ? "h-10 px-8" : "h-9 px-4 py-2",
      className
    )}>
      {children}
    </Comp>
  )
}
