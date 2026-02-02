import type { Metadata } from 'next'
import { Type } from 'lucide-react'
import { FontCard } from '@/components/font-card'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getDesigns } from '@/lib/data'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Font Downloads - Premium & Free Fonts',
  description: 'Download premium and free fonts for your design projects. Serif, sans-serif, display, and handwritten fonts available.',
}

async function getFonts() {
  try {
    const supabase = createServerSupabaseClient()
    // Filter by category = 'Fonts' (case-insensitive using ilike)
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .ilike('category', 'fonts')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching fonts:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Error fetching fonts:', err)
    return []
  }
}

export default async function FontsPage() {
  const [fonts, allDesigns] = await Promise.all([
    getFonts(),
    getDesigns({ limit: 10 }),
  ])

  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
              <Type className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Font Downloads
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Premium and free fonts for every project
              </p>
            </div>
          </div>
          <div className="mt-6">
            <span className="text-sm text-muted-foreground">
              {fonts.length} fonts available
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
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Font Grid */}
            <div className="flex-1">
              {fonts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {fonts.map((font) => (
                    <FontCard key={font.id} font={font} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <Type className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    No fonts available yet. Add designs with category "Fonts" in Supabase.
                  </p>
                </div>
              )}

              {/* Inline Ad */}
              <div className="mt-8">
                <AdSlot variant="inline" />
              </div>
            </div>

            {/* Sidebar - Moves below on mobile */}
            <div className="w-full lg:w-[300px]">
              <Sidebar popularDesigns={popularDesigns} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
