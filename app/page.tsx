import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { DesignGrid } from '@/components/design-grid'
import { DesignGridSkeleton } from '@/components/design-card-skeleton'
import { getDesigns } from '@/lib/data'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { Design } from '@/lib/types'

// ISR: Static with 1 hour revalidation
export const revalidate = 3600



// ─── Sección 1: Top del Mes ───────────────────────────────────────────────────
async function TopDesigns() {
  const designs = await getDesigns({ limit: 100, tag: 'Top del mes', excludeCategory: 'blog' })

  if (!designs || designs.length === 0) return null

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            🔥 Top del mes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Los recursos y plantillas más populares seleccionados por la comunidad
          </p>
        </div>
        <Link
          href="/tags/Top del mes"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
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
    .select('*')
    .neq('category', 'blog')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error || !data) return null

  return <DesignGrid designs={data as Design[]} showAds={false} columns={4} />
}

// ─── Sección 3: Explorar Catálogo (feed rastreable, excluye los primeros 8) ──
async function CatalogFeed() {
  const supabase = createServerSupabaseClient()

  // Fetch a broader set for Google crawlability — offset 8 to avoid duplicating RecentDesigns
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .neq('category', 'blog')
    .order('created_at', { ascending: false })
    .range(8, 107)

  if (error || !data || data.length === 0) return null

  return <DesignGrid designs={data as Design[]} showAds={true} adFrequency={8} columns={4} />
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content - Full Width */}
      <section className="pt-0 sm:pt-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Sección 1: Top del Mes ── */}
          <Suspense fallback={<DesignGridSkeleton />}>
            <TopDesigns />
          </Suspense>

          {/* ── Sección 2: Diseños más recientes ── */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Diseños más recientes
              </h2>
              <p className="mt-2 text-muted-foreground">
                Las últimas plantillas y recursos añadidos al catálogo
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

          <Suspense fallback={<DesignGridSkeleton />}>
            <RecentDesigns />
          </Suspense>

          {/* ── Sección 3: Explorar Catálogo ── */}
          <div className="flex items-end justify-between mb-8 mt-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Explorar Catálogo
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explora todo nuestro catálogo histórico de diseños gratuitos
              </p>
            </div>
          </div>

          <Suspense fallback={<DesignGridSkeleton />}>
            <CatalogFeed />
          </Suspense>
        </div>
      </section>

      {/* Categories moved to bottom */}
      <CategorySection />

      {/* Newsletter / CTA Section */}
      <section className="border-t border-border/40 bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Mantente al Día
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Recibe notificaciones sobre nuevas plantillas, fuentes y contenido exclusivo.
            Únete a nuestra comunidad de más de 25,000 creadores.
          </p>
          <form className="mx-auto mt-8 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary-dark px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

