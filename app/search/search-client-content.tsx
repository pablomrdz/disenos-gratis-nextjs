'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { DesignGrid } from '@/components/design-grid'
import type { DesignCard } from '@/lib/types'

export default function SearchClientContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const [searchResults, setSearchResults] = useState<DesignCard[]>([])
  const [loading, setLoading] = useState(false)

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
        setSearchResults(Array.isArray(data) ? data : [])
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
          Found {searchResults.length} design{searchResults.length === 1 ? '' : 's'} for "{query}"
        </p>
        <DesignGrid designs={searchResults} />
      </div>
    )
  }

  if (query) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">No results found</h2>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search terms or browse our categories.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Start searching</h2>
      <p className="mt-2 text-muted-foreground">
        Use the search bar to find templates, fonts, and resources.
      </p>
    </div>
  )
}