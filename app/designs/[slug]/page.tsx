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
import { AdSlot } from '@/components/ad-slot'
import { AdPlaceholder } from '@/components/ad-placeholder'
import { DesignGrid } from '@/components/design-grid'
import { JsonLd } from '@/components/json-ld'
import { StickySidebar } from '@/components/sticky-sidebar'
import { getDesignBySlug, getDesigns, getTutorials, getRelatedDesignsByTags, getPopularCategories } from '@/lib/data'
import { detectContentType, extractDownloadLink, splitContentForAd } from '@/lib/content-utils'
import { DownloadSection } from './download-section'
import { cn } from '@/lib/utils'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

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
  const description = design.description || 'Download this premium design template'
  const tags = Array.isArray(design.tags) ? design.tags : []

  return {
    title,
    description,
    keywords: tags,
    openGraph: {
      title,
      description,
      images: design.thumbnail_url ? [design.thumbnail_url] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: design.thumbnail_url ? [design.thumbnail_url] : [],
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
  const category = design.category || 'general'
  const tags = Array.isArray(design.tags) ? design.tags : []
  const downloads = design.downloads ?? 0
  const designType = design.type || 'internal'
  const isVip = Boolean(design.premium_url) || design.is_vip
  const createdAt = design.created_at ? new Date(design.created_at) : new Date()

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
        return 'Canva Template'
      case 'capcut':
        return 'CapCut Template'
      case 'font':
        return 'Font Download'
      default:
        return 'Direct Download'
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
              href={`/category/${category}`}
              className="capitalize text-muted-foreground transition-colors hover:text-foreground"
            >
              {category.replace('-', ' ')}
            </Link>
            {primaryTag && (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <Link
                  href={`/designs?tag=${encodeURIComponent(primaryTag)}`}
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
              <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
                <div className={cn(
                  "relative",
                  isBlog ? "aspect-[16/9]" : "aspect-[4/3] sm:aspect-video"
                )}>
                  <Image
                    src={design.thumbnail_url || "/placeholder.svg"}
                    alt={title}
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

              {/* Header Info */}
              <div className="mt-8">
                <h1 className={cn(
                  "text-balance font-bold text-foreground",
                  isBlog ? "text-3xl sm:text-4xl lg:text-5xl font-serif" : "text-2xl sm:text-3xl lg:text-4xl"
                )}>
                  {title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="bg-transparent capitalize">
                    {category.replace('-', ' ')}
                  </Badge>
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
                  <Button asChild size="lg" className="h-14 gap-2 bg-orange-500 px-8 text-lg font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">
                    <a href={finalDownloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                      <Download className="h-5 w-5" />
                      Descargar Ahora
                    </a>
                  </Button>
                  <DownloadSection design={design} isVip={isVip} />
                </div>
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
                      href={`/category/${category}`}
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
