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
import { DesignGrid } from '@/components/design-grid'
import { JsonLd } from '@/components/json-ld'
import { getDesignBySlug, getDesigns, getTutorials } from '@/lib/data'
import { DownloadSection } from './download-section'

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
  const [design, allDesigns, tutorials] = await Promise.all([
    getDesignBySlug(slug),
    getDesigns({ limit: 20 }),
    getTutorials({ limit: 3 }),
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

  // Related designs (same category)
  const relatedDesigns = allDesigns
    .filter((d) => d.category === category && d.id !== design.id)
    .slice(0, 4)
  
  // Related fonts
  const relatedFonts = allDesigns
    .filter((d) => d.type === 'font' && d.id !== design.id)
    .slice(0, 4)

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

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Column */}
            <div className="flex-1 min-w-0">
              <Link
                href="/designs"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all designs
              </Link>

              {/* Design Preview */}
              <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
                <div className="relative aspect-[4/3] sm:aspect-video">
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
                        VIP Content
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

              {/* Design Info Header */}
              <div className="mt-8">
                <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                  {title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="bg-transparent capitalize">
                    {category.replace('-', ' ')}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    {downloads.toLocaleString()} downloads
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {createdAt.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Download Section - Client Component for VIP Logic */}
              <div className="mt-8">
                <DownloadSection design={design} isVip={isVip} />
              </div>

              {/* Full Description */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-foreground">Description</h2>
                <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
                  {description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Tags Section */}
              {tags.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-foreground">Tags</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link 
                        key={tag} 
                        href={`/designs?tag=${encodeURIComponent(tag)}`}
                        className="group"
                      >
                        <Badge 
                          variant="outline" 
                          className="bg-transparent transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          <Tag className="mr-1.5 h-3 w-3" />
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* In-Content Ad */}
              <div className="mt-10">
                <AdSlot type="inline" />
              </div>

              {/* Related Designs */}
              {relatedDesigns.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Related Designs</h2>
                    <Link 
                      href={`/category/${category}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="mt-6">
                    <DesignGrid designs={relatedDesigns} showAds={false} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Moves below main content on mobile */}
            <aside className="w-full space-y-6 lg:w-[320px]">
              {/* Sidebar Ad */}
              <AdSlot type="sidebar" />

              {/* Related Fonts Section */}
              {relatedFonts.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-card p-5">
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Related Fonts</h3>
                  </div>
                  <div className="mt-4 space-y-3">
                    {relatedFonts.map((font) => (
                      <Link
                        key={font.id}
                        href={`/designs/${font.slug || font.id}`}
                        className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={font.thumbnail_url || "/placeholder.svg"}
                            alt={font.title || 'Font preview'}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
                            {font.title || 'Untitled Font'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(font.downloads ?? 0).toLocaleString()} downloads
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/fonts"
                    className="mt-4 block text-center text-sm text-primary hover:underline"
                  >
                    Browse all fonts
                  </Link>
                </div>
              )}

              {/* YouTube Tutorial Embed Section */}
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-foreground">Learn How to Use</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Watch our tutorials to get the most out of this design.
                </p>
                
                {tutorials.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {tutorials.slice(0, 2).map((tutorial) => (
                      <Link
                        key={tutorial.id}
                        href={`/tutorials/${tutorial.slug}`}
                        className="group block overflow-hidden rounded-lg border border-border/50 transition-colors hover:border-primary/50"
                      >
                        <div className="relative aspect-video">
                          <Image
                            src={tutorial.thumbnail_url || "/placeholder.svg"}
                            alt={tutorial.title || 'Tutorial thumbnail'}
                            fill
                            className="object-cover"
                            sizes="280px"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
                              <Play className="h-5 w-5 fill-current" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
                            {tutorial.title || 'Tutorial'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 aspect-video overflow-hidden rounded-lg bg-muted">
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Design Tutorial"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                )}
                
                <Link
                  href="/tutorials"
                  className="mt-4 block text-center text-sm text-primary hover:underline"
                >
                  View all tutorials
                </Link>
              </div>

              {/* Social Proof / E-E-A-T */}
              <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-5">
                <h3 className="font-semibold text-foreground">Why Choose Us?</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Professionally designed by experts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Regular updates and new content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Trusted by 50,000+ creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Free and premium options</span>
                  </li>
                </ul>
              </div>

              {/* Another Sidebar Ad */}
              <AdSlot type="sidebar" />
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
