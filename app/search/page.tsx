import type { Metadata } from 'next'
import { Search as SearchIcon } from 'lucide-react'
import { DesignGrid } from '@/components/design-grid'
import { StickySidebar } from '@/components/sticky-sidebar'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getPopularCategories, getAllTags, DESIGN_CARD_FIELDS } from '@/lib/data'
import type { DesignCard } from '@/lib/types'

// ISR: Static with 1 hour revalidation
export const revalidate = 3600

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

async function searchDesigns(query: string): Promise<DesignCard[]> {
  // Clean PostgREST reserved characters: , ( ) " ' % _
  const sanitizedQuery = query
    .replace(/[,()"'%_]/g, '')
    .trim()

  if (!sanitizedQuery || sanitizedQuery.length < 2) {
    return []
  }

  try {
    const supabase = createServerSupabaseClient()

    // Filtración 100% server-side con query limpia
    const { data, error } = await supabase
      .from('designs')
      .select(DESIGN_CARD_FIELDS)
      .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%,category.ilike.%${sanitizedQuery}%`)
      .order('downloads', { ascending: false })
      .limit(40)

    if (error) {
      console.error('Search error:', error)
      return []
    }

    return (data as DesignCard[]) || []

  } catch (err) {
    console.error('Unexpected search error:', err)
    return []
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const [searchResults, popularCategories, allTags] = await Promise.all([
    searchDesigns(query),
    getPopularCategories(6),
    getAllTags(),
  ])

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

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-3 min-w-0">
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

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <StickySidebar
                popularCategories={popularCategories}
                tags={allTags.slice(0, 20)}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

