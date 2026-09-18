'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { DesignGrid } from '@/components/design-grid'
import type { DesignCard } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'

export default function SearchClientContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const [searchResults, setSearchResults] = useState<DesignCard[]>([])
  const [loading, setLoading] = useState(false)
  const trackedSearchRef = useRef<string | null>(null)

  useEffect(() => {
    // Sanitización de query en el cliente
    const sanitizedQuery = query.replace(/[,()"'%_]/g, '').trim()

    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      setSearchResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Llama al endpoint de búsqueda que ya optimizamos previamente con DESIGN_CARD_FIELDS
    fetch(`/api/search?q=${encodeURIComponent(sanitizedQuery)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Search failed')
        return res.json()
      })
      .then((data) => {
        const designs: DesignCard[] = Array.isArray(data?.designs)
          ? data.designs
          : []

        setSearchResults(designs)

        // Evita duplicados en desarrollo / re-renders
        if (trackedSearchRef.current !== sanitizedQuery) {
          trackEvent('search', {
            search_term: sanitizedQuery,
            search_location: 'search_page',
            results_count: designs.length,
          })

          trackedSearchRef.current = sanitizedQuery
        }
      })
      .catch((err) => {
        console.error('Search error:', err)
        setSearchResults([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [query])

  if (loading) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <SearchIcon className="mx-auto h-12 w-12 animate-spin text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Buscando...</h2>
        <p className="mt-2 text-muted-foreground">Obteniendo diseños para "{query}"</p>
      </div>
    )
  }

  if (searchResults.length > 0) {
    return (
      <div>
        <p className="mb-6 text-sm text-muted-foreground">
          1 {searchResults.length} resultado{searchResults.length === 1 ? '' : 's'} para "{query}"
        </p>
        <DesignGrid designs={searchResults} />
      </div>
    )
  }

  if (query) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">No encontramos resultados</h2>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search terms or browse our categories.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Busca en nuestro catálogo</h2>
      <p className="mt-2 text-muted-foreground">
        Use the search bar to find templates, fonts, and resources.
      </p>
    </div>
  )
}