import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { DesignGrid } from '@/components/design-grid'
import { DESIGN_CARD_FIELDS } from '@/lib/data'
import { createServerSupabaseClient } from '@/lib/supabase'
import AdUnit from '@/components/AdUnit'
import type { DesignCard } from '@/lib/types'
import type { Metadata } from 'next'
import { PrimaryHubsSection } from '@/components/primary-hubs-section'

// ISR: Static with 24 hours revalidation
export const revalidate = 86400

type HomeFeedRow = DesignCard & {
  created_at: string
  is_featured_month: boolean | null
}

async function getHomepageGroups() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('designs')
    .select(`${DESIGN_CARD_FIELDS}, created_at, is_featured_month`)
    .eq('content_type', 'asset')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Error fetching homepage feed:', error)
    throw error
  }

  const rows = (data || []) as HomeFeedRow[]

  const byDownloads = [...rows].sort(
    (a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)
  )

  // Editorial selection is the source of truth. Until the monthly selection
  // is curated, fill missing slots with the most downloaded assets so the
  // section never disappears.
  const featured = rows
    .filter((item) => item.is_featured_month)
    .sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))
    .slice(0, 8)

  const topIds = new Set(featured.map((item) => item.id))

  for (const item of byDownloads) {
    if (featured.length >= 8) break
    if (!topIds.has(item.id)) {
      featured.push(item)
      topIds.add(item.id)
    }
  }

  const recent = [...rows]
    .filter((item) => !topIds.has(item.id))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 8)

  const usedIds = new Set([
    ...featured.map((item) => item.id),
    ...recent.map((item) => item.id),
  ])

  const catalog = byDownloads
    .filter((item) => !usedIds.has(item.id))
    .slice(0, 8)

  return {
    featured: featured as DesignCard[],
    recent: recent as DesignCard[],
    catalog: catalog as DesignCard[],
  }
}

function HomeAd({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'my-8' : 'bg-brand-black pt-6'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            compact
              ? 'flex min-h-[120px] w-full items-center justify-center overflow-hidden'
              : 'flex min-h-[100px] w-full items-center justify-center overflow-hidden sm:min-h-[250px]'
          }
        >
          <AdUnit
            slot="9549519747"
            format="horizontal"
            style={{ display: 'block', width: '100%' }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

function SectionHeading({
  title,
  description,
  href,
  linkLabel = 'Ver todo',
}: {
  title: string
  description: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-white sm:text-3xl">
          {title}
          <span className="text-brand-cyan">.</span>
        </h2>
        <p className="mt-2 text-brand-gray">{description}</p>
      </div>

      {href && (
        <Link
          href={href}
          className="hidden items-center gap-1 text-sm font-bold text-brand-cyan hover:underline sm:flex"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const { featured, recent, catalog } = await getHomepageGroups()

  return (
    <>
      <HeroSection />
      <CategorySection />

      {/* ATF: after search/hero and categories */}
      <HomeAd />

      <section className="bg-brand-black pb-16 pt-8 text-brand-white sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section>
            <SectionHeading
              title="🔥 Top del mes"
              description="Los recursos más destacados y descargados de Diseños Gratis"
              href="/designs"
              linkLabel="Ver catálogo"
            />
            <DesignGrid designs={featured} showAds={false} columns={4} />
          </section>

          {/* Ad after first 8 cards */}
          <HomeAd compact />

          <section>
            <SectionHeading
              title="Diseños más recientes"
              description="Las últimas plantillas y recursos añadidos al catálogo"
              href="/designs"
              linkLabel="Ver todos los diseños"
            />
            <DesignGrid designs={recent} showAds={false} columns={4} />
          </section>

          {/* Ad after 16 cards */}
          <HomeAd compact />

          <section className="mt-12">
            <SectionHeading
              title="Explorar catálogo"
              description="Ocho recursos adicionales para seguir descubriendo el catálogo"
              href="/designs"
              linkLabel="Explorar catálogo"
            />
            <DesignGrid designs={catalog} showAds={false} columns={4} />
          </section>
        </div>
      </section>

      <PrimaryHubsSection />
    </>
  )
}
