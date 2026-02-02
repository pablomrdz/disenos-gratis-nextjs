import type { Metadata } from 'next'
import { Search as SearchIcon } from 'lucide-react'
import { DesignGrid } from '@/components/design-grid'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getDesigns } from '@/lib/data'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  const query = q?.trim() || ''
  
  return {
    title: query ? `Search: ${query}` : 'Search Designs',
    description: query 
      ? `Search results for "${query}" - Find design templates, fonts, and resources`
      : 'Search our collection of premium design templates, fonts, and resources',
  }
}

async function searchDesigns(query: string) {
  if (!query || query.length < 2) {
    return []
  }

  try {
    const supabase = createServerSupabaseClient()
    
    // Search by title using ilike for case-insensitive search
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('downloads', { ascending: false })
      .limit(30)

    if (error) {
      console.error('Search error:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected search error:', err)
    return []
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''
  
  const [searchResults, allDesigns] = await Promise.all([
    searchDesigns(query),
    getDesigns({ limit: 10 }),
  ])

  const popularDesigns = [...allDesigns].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 5)

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {query ? `Results for "${query}"` : 'Search Designs'}
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} design${searchResults.length === 1 ? '' : 's'}`
                  : query 
                    ? 'No designs found'
                    : 'Enter a search term to find designs'}
              </p>
            </div>
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
            {/* Main Column */}
            <div className="flex-1">
              {searchResults.length > 0 ? (
                <DesignGrid designs={searchResults} />
              ) : query ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h2 className="mt-4 text-lg font-semibold text-foreground">No results found</h2>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search terms or browse our categories.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h2 className="mt-4 text-lg font-semibold text-foreground">Start searching</h2>
                  <p className="mt-2 text-muted-foreground">
                    Use the search bar to find templates, fonts, and resources.
                  </p>
                </div>
              )}
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
