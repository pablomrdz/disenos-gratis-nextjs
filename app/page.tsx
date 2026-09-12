import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { DesignGrid } from '@/components/design-grid'
import { DesignGridSkeleton } from '@/components/design-card-skeleton'
import { getDesigns, DESIGN_CARD_FIELDS } from '@/lib/data'
import { createServerSupabaseClient } from '@/lib/supabase'
import AdUnit from '@/components/AdUnit'
import type { DesignCard } from '@/lib/types' 
import type { Metadata } from 'next'
import { PrimaryHubsSection } from '@/components/primary-hubs-section'

// ISR: Static with 24 hours revalidation
export const revalidate = 86400

// ─── Sección 1: Top del Mes ───────────────────────────────────────────────────
async function TopDesigns() {
  const designs = await getDesigns({
  limit:8,
  tag: 'Top del mes',
  contentType: 'asset'
})

  if (!designs || designs.length === 0) return null

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-white sm:text-3xl">
            🔥 Top del mes<span className="text-brand-cyan">.</span>
          </h2>
          <p className="mt-2 text-brand-gray">
            Los recursos y plantillas más populares seleccionados por la comunidad
          </p>
        </div>
        <Link
          href="/tags/top-del-mes/"
          className="hidden items-center gap-1 text-sm font-bold text-brand-cyan hover:underline sm:flex"
        >
          Ver todo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <DesignGrid designs={designs} showAds={false} columns={4} />
    </div>
  )
}

// ─── Sección 2: Diseños más recientes ────────────────────────────────────────
async function RecentDesigns() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('designs')
    .select(DESIGN_CARD_FIELDS)
    .eq('content_type', 'asset')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    console.error('Error fetching catalog feed:', error)
    throw error
  }

if (!data || data.length === 0) return null
  return <DesignGrid designs={data as DesignCard[]} showAds={false} columns={4} />
}

// ─── Sección 3: Explorar Catálogo (feed rastreable, excluye los primeros 8) ──
async function CatalogFeed() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('designs')
    .select(DESIGN_CARD_FIELDS)
    .eq('content_type', 'asset')
    .order('created_at', { ascending: false })
    .range(8, 107)

  if (error || !data || data.length === 0) return null

  return <DesignGrid designs={data as DesignCard[]} showAds={true} adFrequency={8} columns={4} />
}

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories section */}
      <CategorySection />

      {/* ⚡ BANNER ATF (Above the Fold) - Transparente e integrado */}
      <div className="bg-brand-black pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[100px] sm:min-h-[250px] w-full items-center justify-center overflow-hidden">
            <AdUnit
              slot="9549519747"
              format="horizontal"
              style={{ display: "block", width: "100%" }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <section className="pt-8 sm:pt-12 pb-16 bg-brand-black text-brand-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Sección 1: Top del Mes ── */}
          <Suspense fallback={<DesignGridSkeleton />}>
            <TopDesigns />
          </Suspense>

          {/* ── Sección 2: Diseños más recientes ── */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-brand-white sm:text-3xl">
                Diseños más recientes<span className="text-brand-cyan">.</span>
              </h2>
              <p className="mt-2 text-brand-gray">
                Las últimas plantillas y recursos añadidos al catálogo
              </p>
            </div>
            <Link
              href="/designs"
              className="hidden items-center gap-1 text-sm font-bold text-brand-cyan hover:underline sm:flex"
            >
              Ver todos los diseños
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Suspense fallback={<DesignGridSkeleton />}>
            <RecentDesigns />
          </Suspense>

          {/* ── Sección 3: Explorar Catálogo ── */}
          <div className="flex items-end justify-between mb-8 mt-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-brand-white sm:text-3xl">
                Explorar Catálogo<span className="text-brand-cyan">.</span>
              </h2>
              <p className="mt-2 text-brand-gray">
                Explora todo nuestro catálogo histórico de diseños gratuitos
              </p>
            </div>
          </div>

          <Suspense fallback={<DesignGridSkeleton />}>
            <CatalogFeed />
          </Suspense>
        </div>
      </section> 

    {/* Hub de Categorias */}
      <PrimaryHubsSection />

    </>
  )
}