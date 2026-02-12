import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import { TutorialCard } from '@/components/tutorial-card'
import { JsonLd } from '@/components/json-ld'
import { getTutorialBySlug, getTutorials, getDesigns } from '@/lib/data'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

interface TutorialPageProps {
  params: Promise<{ slug: string }>
}

// Pinterest icon component
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params
  const tutorial = await getTutorialBySlug(slug)

  if (!tutorial) {
    return { title: 'Tutorial Not Found' }
  }

  return {
    title: tutorial.title,
    description: tutorial.description,
    openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      images: [tutorial.thumbnail_url],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: tutorial.title,
      description: tutorial.description,
      images: [tutorial.thumbnail_url],
    },
  }
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params
  const [tutorial, allTutorials, allDesigns] = await Promise.all([
    getTutorialBySlug(slug),
    getTutorials(),
    getDesigns({ limit: 10 }),
  ])

  if (!tutorial) {
    notFound()
  }

  const relatedTutorials = allTutorials
    .filter((t) => t.category === tutorial.category && t.id !== tutorial.id)
    .slice(0, 2)
  
  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd type="article" data={tutorial} />

      {/* Breadcrumb */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/tutorials" className="text-muted-foreground hover:text-foreground">
              Tutorials
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{tutorial.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Main Column */}
            <div>
              <Link
                href="/tutorials"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to tutorials
              </Link>

              {/* Video Player */}
              <div className="overflow-hidden rounded-xl border border-border/50 bg-muted">
                <div className="relative aspect-video">
                  <iframe
                    src={tutorial.youtube_embed_url}
                    title={tutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>

              {/* Tutorial Info */}
              <div className="mt-8">
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {tutorial.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="capitalize">
                    {tutorial.category.replace('-', ' ')}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(tutorial.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Social Links */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted-foreground">Also available on:</span>
                  {tutorial.pinterest_url && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={tutorial.pinterest_url} target="_blank" rel="noopener noreferrer">
                        <PinterestIcon className="h-4 w-4" />
                        Pinterest
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {tutorial.tiktok_url && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={tutorial.tiktok_url} target="_blank" rel="noopener noreferrer">
                        <TikTokIcon className="h-4 w-4" />
                        TikTok
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-foreground">About this tutorial</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {tutorial.description}
                  </p>
                </div>
              </div>

              {/* Related Tutorials */}
              {relatedTutorials.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-xl font-bold text-foreground">Related Tutorials</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {relatedTutorials.map((t) => (
                      <TutorialCard key={t.id} tutorial={t} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <Sidebar popularDesigns={popularDesigns} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
