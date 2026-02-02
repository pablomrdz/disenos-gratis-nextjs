import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { getDesigns, getCategoryBySlug, getCategories } from '@/lib/data'
import { Share2, Presentation, Type, Video, Palette, Printer } from 'lucide-react'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categoryIcons: Record<string, typeof Share2> = {
  'social-media': Share2,
  'presentations': Presentation,
  'fonts': Type,
  'video-templates': Video,
  'brand-kits': Palette,
  'print-design': Printer,
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${category.name} Templates & Resources`,
    description: `Browse our collection of ${category.name.toLowerCase()} templates and resources. ${category.description}`,
    openGraph: {
      title: `${category.name} Templates | DesignHub`,
      description: category.description,
    },
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, designs, allDesigns] = await Promise.all([
    getCategoryBySlug(slug),
    getDesigns({ category: slug }),
    getDesigns({ limit: 10 }),
  ])

  if (!category) {
    notFound()
  }

  const Icon = categoryIcons[slug] || Share2
  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* Category Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                {category.description}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <span className="text-sm text-muted-foreground">
              {designs.length} templates available
            </span>
          </div>
        </div>
      </section>

      {/* Hero Ad */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdSlot variant="hero" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Design Grid */}
            <div>
              {designs.length > 0 ? (
                <DesignGrid designs={designs} showAds={true} adFrequency={8} />
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    No designs found in this category yet.
                  </p>
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
