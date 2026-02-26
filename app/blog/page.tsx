import type { Metadata } from 'next'
import Link from 'next/link'
import { Video, ExternalLink } from 'lucide-react'
import { TutorialCard } from '@/components/tutorial-card'
import { DesignCard } from '@/components/design-card'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { GoogleAd } from '@/components/google-ad'
import { Button } from '@/components/ui/button'
import { getTutorials, getDesigns } from '@/lib/data'

// Force SSR for SEO
// ISR: Static with 1 hour revalidation
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog de Diseño - Tutoriales y Recursos Gratis',
  description: 'Aprende a dominar herramientas de diseño y descarga los mejores recursos gratuitos.',
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

export default async function TutorialsPage() {
  const [blogPosts, allDesigns] = await Promise.all([
    getDesigns({ category: 'blog' }),
    getDesigns({ limit: 10, excludeCategory: 'blog' }),
  ])

  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <Video className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Blog de Diseño
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Artículos, tutoriales y recursos para mejorar tus diseños
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-sm text-muted-foreground">Follow us for more:</span>
            <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <PinterestIcon className="h-4 w-4" />
                Pinterest
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <TikTokIcon className="h-4 w-4" />
                TikTok
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Tutorial Grid */}
            <div>
              <div className="mb-8">
                <GoogleAd adUnitName="in feed para listas" height={250} />
              </div>

              {blogPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {blogPosts.map((post) => (
                    <DesignCard key={post.id} design={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    Cargando artículos...
                  </p>
                </div>
              )}

              {/* Bottom Ad */}
              <div className="mt-8">
                <GoogleAd adUnitName="in feed para listas" height={250} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="mx-auto max-w-[300px]">
                <Sidebar popularDesigns={popularDesigns} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
