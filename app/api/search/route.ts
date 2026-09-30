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

function normalizeList(value: unknown): string {
  if (Array.isArray(value)) {
    return normalizeSearchText(value.filter(Boolean).join(' '))
  }

  if (typeof value === 'string') {
    return normalizeSearchText(value)
  }

  return ''
}

type SearchableDesign = DesignCard & {
  tags?: string[] | null
  related_keywords?: string[] | string | null
  technical_type?: string | null
  content?: string | null
}

function getSearchScore(
  item: SearchableDesign,
  normalizedQuery: string,
  tokens: string[]
): number {
  const fields = {
    title: normalizeSearchText(item.title || ''),
    tags: normalizeList(item.tags),
    relatedKeywords: normalizeList(item.related_keywords),
    excerpt: normalizeSearchText(item.excerpt || ''),
    category: normalizeSearchText(item.category || ''),
    technicalType: normalizeSearchText(item.technical_type || ''),
    content: normalizeSearchText(item.content || ''),
  }

  let score = 0

  const weights = [
    [fields.title, 10],
    [fields.tags, 8],
    [fields.relatedKeywords, 7],
    [fields.excerpt, 5],
    [fields.category, 4],
    [fields.technicalType, 2],
    [fields.content, 1],
  ] as const

  for (const [field, weight] of weights) {
    if (!field) continue

    if (field.includes(normalizedQuery)) {
      score += weight * 3
    }

    for (const token of tokens) {
      if (field.includes(token)) {
        score += weight
      }
    }
  }

  return score
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

    // Current catalog is small enough to do accent-insensitive matching and
    // lightweight relevance scoring in the application layer. When the catalog
    // grows substantially, migrate this to a Postgres search_vector/unaccent
    // RPC with a GIN index instead of increasing this limit.
    const { data, error } = await supabase
      .from('designs')
      .select(
        `${DESIGN_CARD_FIELDS}, tags, related_keywords, technical_type, content`
      )
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

    const matches = ((data || []) as SearchableDesign[])
      .map((item) => {
        const searchableText = normalizeSearchText(
          [
            item.title || '',
            item.excerpt || '',
            item.category || '',
            normalizeList(item.tags),
            normalizeList(item.related_keywords),
            item.technical_type || '',
            item.content || '',
          ].join(' ')
        )

        return {
          item,
          matches: tokens.every((token) => searchableText.includes(token)),
          score: getSearchScore(item, normalizedQuery, tokens),
        }
      })
      .filter(({ matches }) => matches)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return (b.item.downloads || 0) - (a.item.downloads || 0)
      })
      .slice(0, 20)
      .map(({ item }) => item)

    return NextResponse.json({
      designs: matches as DesignCard[],
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
