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
    const sanitizedQuery = query.replace(/[,()"'%_]/g, '').trim()

    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      setSearchResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)

    fetch(`/api/search?q=${encodeURIComponent(sanitizedQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Search failed')
        return res.json()
      })
      .then((data) => {
        const designs: DesignCard[] = Array.isArray(data?.designs)
          ? data.designs
          : []

        setSearchResults(designs)

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
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('Search error:', err)
        setSearchResults([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
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
          {searchResults.length} resultado{searchResults.length === 1 ? '' : 's'} para "{query}"
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
          Prueba con otros términos o explora nuestras categorías.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Busca en nuestro catálogo</h2>
      <p className="mt-2 text-muted-foreground">
        Usa el buscador para encontrar diseños, plantillas, tipografías y recursos.
      </p>
    </div>
  )
}
