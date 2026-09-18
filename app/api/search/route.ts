import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { DESIGN_CARD_FIELDS } from '@/lib/data'
import type { DesignCard } from '@/lib/types'

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get('q')?.trim() || ''
  const sanitizedQuery = rawQuery.replace(/[,()"'%_]/g, '').trim()
  const normalizedQuery = normalizeSearchText(sanitizedQuery)

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return NextResponse.json({
      designs: [],
      message: 'Query too short',
    })
  }

  try {
    const supabase = createServerSupabaseClient()

    // Current catalog is small enough to do accent-insensitive matching in the
    // application layer. When the catalog grows substantially, migrate this
    // to a Postgres search_vector/unaccent RPC instead of increasing the limit.
    const { data, error } = await supabase
      .from('designs')
      .select(`${DESIGN_CARD_FIELDS}, tags`)
      .eq('content_type', 'asset')
      .order('downloads', { ascending: false })
      .limit(300)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { designs: [], error: 'Search failed' },
        { status: 500 }
      )
    }

    const tokens = normalizedQuery.split(' ').filter(Boolean)

    const matches = (data || []).filter((item) => {
      const tags = Array.isArray(item.tags) ? item.tags.join(' ') : ''
      const haystack = normalizeSearchText(
        [
          item.title || '',
          item.excerpt || '',
          item.category || '',
          tags,
        ].join(' ')
      )

      return tokens.every((token) => haystack.includes(token))
    })

    return NextResponse.json({
      designs: matches.slice(0, 20) as DesignCard[],
    })
  } catch (err) {
    console.error('Unexpected search error:', err)

    return NextResponse.json(
      {
        designs: [],
        error: 'Search failed',
      },
      { status: 500 }
    )
  }
}
