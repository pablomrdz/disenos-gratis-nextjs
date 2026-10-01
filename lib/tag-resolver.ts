import { createServerSupabaseClient } from './supabase'
import { DESIGN_CARD_FIELDS } from './data'
import { slugify } from './utils'
import type { DesignCard } from './types'

/**
 * Tags are stored as human-readable values (for example "Niñas", "K-Pop",
 * "Guerreras K-Pop") while public URLs use normalized slugs. Postgres array
 * containment is case/accent/punctuation-sensitive, so resolving a URL by
 * guessing capitalization is fragile. These helpers make slugify() the single
 * source of truth for tag routing.
 */
export async function getAllAssetTags(): Promise<string[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('designs')
    .select('tags')
    .eq('content_type', 'asset')

  if (error) {
    console.error('Error fetching asset tags:', error)
    return []
  }

  const bySlug = new Map<string, string>()

  for (const row of data || []) {
    const tags = Array.isArray(row.tags) ? row.tags : []
    for (const tag of tags) {
      if (typeof tag !== 'string' || !tag.trim()) continue
      const cleanSlug = slugify(tag)
      if (!cleanSlug) continue
      if (!bySlug.has(cleanSlug)) bySlug.set(cleanSlug, tag.trim())
    }
  }

  return Array.from(bySlug.values()).sort((a, b) => a.localeCompare(b, 'es'))
}

export async function getDesignsByNormalizedTag(
  requestedTagOrSlug: string,
  limit: number = 100
): Promise<{ designs: DesignCard[]; tagName: string | null }> {
  const cleanSlug = slugify(decodeURIComponent(requestedTagOrSlug))
  if (!cleanSlug) return { designs: [], tagName: null }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('designs')
    .select(`${DESIGN_CARD_FIELDS}, tags`)
    .eq('content_type', 'asset')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error) {
    console.error(`Error resolving tag slug ${cleanSlug}:`, error)
    return { designs: [], tagName: null }
  }

  let tagName: string | null = null
  const designs: DesignCard[] = []

  for (const item of data || []) {
    const tags = Array.isArray(item.tags) ? item.tags : []
    const matchedTag = tags.find(
      (tag) => typeof tag === 'string' && slugify(tag) === cleanSlug
    )

    if (!matchedTag) continue
    if (!tagName) tagName = matchedTag

    const { tags: _tags, ...card } = item
    designs.push(card as DesignCard)

    if (designs.length >= limit) break
  }

  return { designs, tagName }
}

export async function getAssetTagNameBySlug(slug: string): Promise<string | null> {
  const { tagName } = await getDesignsByNormalizedTag(slug, 1)
  return tagName
}
