import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { DESIGN_CARD_FIELDS } from '@/lib/data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const rawQuery = searchParams.get('q')?.trim() || ''
  const query = rawQuery.replace(/[,()"'%_]/g, '').trim()

  if (!query || query.length < 2) {
    return NextResponse.json({
      designs: [],
      message: 'Query too short',
    })
  }

  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('designs')
      .select(DESIGN_CARD_FIELDS)
      .or(`title.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('content_type', 'asset')
      .order('downloads', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Search error:', error)

      const { data: fallbackData, error: fallbackError } = await supabase
        .from('designs')
        .select(DESIGN_CARD_FIELDS)
        .ilike('title', `%${query}%`)
        .eq('content_type', 'asset')
        .order('downloads', { ascending: false })
        .limit(20)

      if (fallbackError) {
        console.error('Fallback search error:', fallbackError)

        return NextResponse.json(
          {
            designs: [],
            error: 'Search failed',
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        designs: fallbackData || [],
      })
    }

    return NextResponse.json({
      designs: data || [],
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