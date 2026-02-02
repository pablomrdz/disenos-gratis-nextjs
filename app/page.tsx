import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { getDesigns } from '@/lib/data'
import { Skeleton } from '@/components/ui/skeleton'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

function DesignGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

async function FeaturedDesigns() {
  const designs = await getDesigns({ limit: 9 })
  return <DesignGrid designs={designs} showAds={true} adFrequency={6} />
}

async function SidebarContent() {
  const [popular, recent] = await Promise.all([
    getDesigns({ limit: 5 }),
    getDesigns({ limit: 5 }),
  ])
  
  // Sort by downloads for popular
  const popularSorted = [...popular].sort((a, b) => b.downloads - a.downloads)
  
  return <Sidebar popularDesigns={popularSorted} recentDesigns={recent} />
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <CategorySection />

      {/* Main Content with Sidebar */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Featured Designs
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hand-picked templates for your creative projects
              </p>
            </div>
            <Link
              href="/designs"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              View all designs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Main Content */}
            <div>
              <Suspense fallback={<DesignGridSkeleton />}>
                <FeaturedDesigns />
              </Suspense>
              
              {/* Inline Ad after designs */}
              <div className="mt-8">
                <AdSlot variant="inline" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
                <SidebarContent />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

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
