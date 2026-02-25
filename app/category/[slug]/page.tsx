import { Suspense } from 'react'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { GoogleAd } from '@/components/google-ad'
import { getDesigns } from '@/lib/data'
import { DesignGridSkeleton } from '@/components/design-card-skeleton'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { Design } from '@/lib/types'
import {
  Printer,
  Scissors,
  Type,
  Box,
  Palette,
  Layout,
  Video,
  Zap,
  Search,
  Image as ImageIcon,
  FolderOpen
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase()
  if (s.includes('dtf') || s.includes('impresion')) return <Printer className="h-8 w-8 text-blue-500" />
  if (s.includes('vinil') || s.includes('corte')) return <Scissors className="h-8 w-8 text-purple-500" />
  if (s.includes('tipografia') || s.includes('fuente')) return <Type className="h-8 w-8 text-amber-500" />
  if (s.includes('3d')) return <Box className="h-8 w-8 text-indigo-500" />
  if (s.includes('recurso') || s.includes('vector')) return <Palette className="h-8 w-8 text-pink-500" />
  if (s.includes('plantilla')) return <Layout className="h-8 w-8 text-emerald-500" />
  if (s.includes('blog') || s.includes('tutorial')) return <Video className="h-8 w-8 text-red-500" />
  if (s.includes('sublimacion')) return <Zap className="h-8 w-8 text-orange-500" />
  return <FolderOpen className="h-8 w-8 text-primary" />
}

const getCategoryColor = (slug: string) => {
  const s = slug.toLowerCase()
  if (s.includes('dtf')) return 'bg-blue-500/10'
  if (s.includes('vinil')) return 'bg-purple-500/10'
  if (s.includes('tipografia')) return 'bg-amber-500/10'
  if (s.includes('3d')) return 'bg-indigo-500/10'
  if (s.includes('recurso')) return 'bg-pink-500/10'
  if (s.includes('plantilla')) return 'bg-emerald-500/10'
  if (s.includes('blog')) return 'bg-red-500/10'
  if (s.includes('sublimacion')) return 'bg-orange-500/10'
  return 'bg-primary/10'
}

async function CategoryContent({ slug }: { slug: string }) {
  // ... rest of CategoryContent ...
  const supabase = createServerSupabaseClient()
  const { data: allDesigns, error } = await supabase.from('designs').select('*').order('created_at', { ascending: false }).limit(1000);
  if (error || !allDesigns) return <div className="rounded-lg border border-dashed p-12 text-center"><p>Error loading designs.</p></div>;
  const normalize = (str: string) => decodeURIComponent(str || '').toLowerCase().replace(/-/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const targetSlug = normalize(slug);
  const designs = (allDesigns as Design[]).filter(d => {
    const cat = normalize(d.category);
    return cat.includes(targetSlug);
  });
  if (designs.length === 0) return <div className="rounded-lg border border-dashed p-12 text-center"><h2 className="text-xl font-semibold">No se encontraron diseños</h2><p className="mt-2 text-muted-foreground">No hemos encontrado diseños para esta categoría todavía ({slug}).</p></div>;

  return (
    <div className="space-y-8">
      <GoogleAd adUnitName="in feed para listas" height={250} />
      <DesignGrid designs={designs} showAds={true} adFrequency={6} columns={3} />
      <GoogleAd adUnitName="in feed para listas" height={250} />
    </div>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const allDesigns = await getDesigns({ limit: 10, excludeCategory: 'blog' })
  const popularDesigns = [...allDesigns].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 5)

  const categoryName = decodeURIComponent(slug).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return (
    <>
      {/* Page Header with Icon */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${getCategoryColor(slug)}`}>
              {getCategoryIcon(slug)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {categoryName}
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Explora nuestra colección de diseños para {categoryName}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <Suspense fallback={<DesignGridSkeleton />}>
              <CategoryContent slug={slug} />
            </Suspense>
          </div>

          <aside className="w-full lg:w-[300px]">
            <Sidebar popularDesigns={popularDesigns} />
          </aside>
        </div>
      </div>
    </>
  )
}
