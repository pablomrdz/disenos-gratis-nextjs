import { Suspense } from 'react'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { getDesigns } from '@/lib/data'
import { Skeleton } from '@/components/ui/skeleton'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

function DesignGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

async function CategoryContent({ slug }: { slug: string }) {
  const supabase = createServerSupabaseClient()

  // Fetch designs where category or category_seo matches the slug (fuzzy/case-insensitive)
  // Special case for 'tipografias' -> look for 'Tipografías' or 'Fonts'
  let query = supabase.from('designs').select('*')

  if (slug === 'tipografias') {
    query = query.or('category.ilike.%Tipografías%,category.ilike.%Fonts%,category_seo.ilike.%Tipografias%')
  } else {
    query = query.or(`category.ilike.%${slug}%,category_seo.ilike.%${slug}%`)
  }

  const { data: designs, error } = await query.order('created_at', { ascending: false })

  if (error || !designs || designs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h2 className="text-xl font-semibold">No se encontraron diseños</h2>
        <p className="mt-2 text-muted-foreground">No hemos encontrado diseños para esta categoría todavía.</p>
      </div>
    )
  }

  return <DesignGrid designs={designs} showAds={true} adFrequency={6} />
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const allDesigns = await getDesigns({ limit: 10, excludeCategory: 'blog' })
  const popularDesigns = [...allDesigns].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 5)

  const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Categoría: {categoryName}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Explora nuestra colección de diseños para {categoryName}
            </p>
          </div>

          <Suspense fallback={<DesignGridSkeleton />}>
            <CategoryContent slug={slug} />
          </Suspense>
        </div>

        <aside className="w-full lg:w-[300px]">
          <Sidebar popularDesigns={popularDesigns} />
        </aside>
      </div>
    </div>
  )
}
