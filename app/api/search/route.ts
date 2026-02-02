import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json({ designs: [], message: 'Query too short' })
  }

  try {
    const supabase = createServerSupabaseClient()
    
    // Search by title or tags using ilike for case-insensitive search
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .or(`title.ilike.%${query}%,tags.cs.{${query}}`)
      .order('downloads', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Search error:', error)
      // Fallback to title-only search if tags search fails
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('designs')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('downloads', { ascending: false })
        .limit(20)

      if (fallbackError) {
        return NextResponse.json({ designs: [], error: 'Search failed' }, { status: 500 })
      }
      return NextResponse.json({ designs: fallbackData || [] })
    }

    return NextResponse.json({ designs: data || [] })
  } catch (err) {
    console.error('Unexpected search error:', err)
    return NextResponse.json({ designs: [], error: 'Search failed' }, { status: 500 })
  }
}
