import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { GoogleAd } from '@/components/google-ad'
import { DesignGridSkeleton } from '@/components/design-card-skeleton'
import { getDesigns } from '@/lib/data'

// Force SSR for SEO
export const dynamic = 'force-dynamic'



async function FeaturedDesigns() {
  const designs = await getDesigns({ limit: 16, excludeCategory: 'blog' })
  return <DesignGrid designs={designs} showAds={true} adFrequency={8} />
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Ad Mobile Top */}
      <div className="lg:hidden mx-auto px-4 mt-8">
        <GoogleAd adUnitName="home mobile" height={100} />
      </div>

      {/* Categories */}
      <CategorySection />

      {/* Main Content - Full Width */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Diseños Destacados
              </h2>
              <p className="mt-2 text-muted-foreground">
                Plantillas seleccionadas para tus proyectos creativos
              </p>
            </div>
            <Link
              href="/designs"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              Ver todos los diseños
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            <Suspense fallback={<DesignGridSkeleton />}>
              <FeaturedDesigns />
            </Suspense>

            {/* Inline Ad after designs */}
            <div className="mt-8">
              <GoogleAd adUnitName="in feed para listas" height={250} />
            </div>
          </div>
        </div>
      </section>

      {/* Ad Mobile Bottom */}
      <div className="lg:hidden mx-auto px-4 mb-8">
        <GoogleAd adUnitName="home mobile" height={100} />
      </div>

      {/* Newsletter / CTA Section */}
      <section className="border-t border-border/40 bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Stay Updated
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Get notified about new templates, fonts, and exclusive VIP content.
            Join our community of 25,000+ creators.
          </p>
          <form className="mx-auto mt-8 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
