import { createServerSupabaseClient } from './supabase'
import { mockDesigns, mockTutorials, mockBlogPosts, mockCategories } from './mock-data'
import type { Design, Tutorial, BlogPost, Category } from './types'

// Always use real Supabase when URL is configured
const USE_MOCK = false

// Designs
export async function getDesigns(options?: {
  category?: string
  type?: string
  limit?: number
  isVip?: boolean
  excludeCategory?: string
}): Promise<Design[]> {
  if (USE_MOCK) {
    let designs = [...mockDesigns]
    if (options?.category) {
      designs = designs.filter(d => d.category === options.category)
    }
    if (options?.type) {
      designs = designs.filter(d => d.type === options.type)
    }
    if (options?.isVip !== undefined) {
      designs = designs.filter(d => d.is_vip === options.isVip)
    }
    if (options?.limit) {
      designs = designs.slice(0, options.limit)
    }
    return designs
  }

  try {
    const supabase = createServerSupabaseClient()
    let query = supabase.from('designs').select('*')

    if (options?.category) {
      // Handle both hyphenated and space-separated versions of the category
      // This fixes issues where 'fondos-y-texturas' in URL doesn't match 'Fondos y Texturas' in DB
      const slug = options.category;
      const spaceVariation = slug.replace(/-/g, ' ');

      // Use ilike logic to match either variation
      // Simplest robust way: 
      // category.ilike.%slug% OR category.ilike.%spaceVariation%

      const searchTerms = [slug, spaceVariation];

      // Add accented variations for known categories
      if (slug === 'recursos-graficos') searchTerms.push('recursos gráficos');
      if (slug === 'sublimacion') searchTerms.push('sublimación');
      if (slug === 'tipografias') searchTerms.push('tipografías');
      if (slug === 'corte-laser') searchTerms.push('corte láser');

      // Construct the OR query string
      const orQuery = searchTerms.map(term => `category.ilike.%${term}%`).join(',');
      query = query.or(orQuery);
    }
    if (options?.type) {
      query = query.eq('type', options.type)
    }
    if (options?.isVip !== undefined) {
      query = query.eq('is_vip', options.isVip)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.excludeCategory) {
      query = query.neq('category', options.excludeCategory)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching designs:', error)
      return mockDesigns
    }

    return data || []
  } catch (err) {
    console.error('Error fetching designs:', err)
    return mockDesigns
  }
}

export async function getDesignBySlug(slug: string): Promise<Design | null> {
  if (USE_MOCK) {
    return mockDesigns.find(d => d.slug === slug) || null
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching design:', error)
    return null
  }

  return data
}

// Tutorials
export async function getTutorials(options?: {
  category?: string
  limit?: number
}): Promise<Tutorial[]> {
  if (USE_MOCK) {
    let tutorials = [...mockTutorials]
    if (options?.category) {
      tutorials = tutorials.filter(t => t.category === options.category)
    }
    if (options?.limit) {
      tutorials = tutorials.slice(0, options.limit)
    }
    return tutorials
  }

  const supabase = createServerSupabaseClient()
  let query = supabase.from('tutorials').select('*')

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tutorials:', error)
    return mockTutorials
  }

  return data || []
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  if (USE_MOCK) {
    return mockTutorials.find(t => t.slug === slug) || null
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching tutorial:', error)
    return null
  }

  return data
}

// Blog Posts
export async function getBlogPosts(options?: {
  category?: string
  limit?: number
}): Promise<BlogPost[]> {
  if (USE_MOCK) {
    let posts = [...mockBlogPosts]
    if (options?.category) {
      posts = posts.filter(p => p.category === options.category)
    }
    if (options?.limit) {
      posts = posts.slice(0, options.limit)
    }
    return posts
  }

  const supabase = createServerSupabaseClient()
  let query = supabase.from('blog_posts').select('*')

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return mockBlogPosts
  }

  return data || []
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (USE_MOCK) {
    return mockBlogPosts.find(p => p.slug === slug) || null
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  return data
}

// Categories
// Strict list of allowed categories (from WP migration)
export const ALLOWED_SLUGS = [
  'blog',
  'corte-laser',
  'dtf',
  'fondos-y-texturas',
  'plantillas',
  'recursos-graficos',
  'sublimacion',
  'tipografias',
  'vectores',
  'vinil-textil'
];

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    return mockCategories
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    // Return empty or valid static structure based on ALLOWED_SLUGS instead of mockCategories
    return ALLOWED_SLUGS
      .map((slug, index) => ({
        id: `fallback-${index}`,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // capitalized
        slug: slug,
        description: 'Category',
        icon: 'Folder'
      }))
  }

  // Filter out any categories not in the allowed list and any that contain commas (dirty data)
  const cleanCategories = ((data as any[]) || []).filter(cat => {
    // Basic clean checks
    if (!cat.slug || cat.slug === 'uncategorized' || cat.slug.includes(',')) return false;

    // Strict Clean: Must be in our allowed list
    const normalizedSlug = cat.slug.toLowerCase().trim().replace(/\s+/g, '-');
    return ALLOWED_SLUGS.includes(normalizedSlug);
  });

  return cleanCategories;
}

// Helper to extract a single valid category from a potentially dirty comma-separated string
export function getPrimaryCategory(rawCategory: string | undefined | null): string {
  if (!rawCategory) return 'uncategorized';

  // 1. Try exact match first (normalized)
  const normalized = rawCategory.toLowerCase().trim().replace(/\s+/g, '-');
  if (ALLOWED_SLUGS.includes(normalized)) return normalized;

  // 2. Split by comma and find the first valid one
  const parts = rawCategory.split(',').map(p => p.trim());
  for (const part of parts) {
    const partSlug = part.toLowerCase().replace(/\s+/g, '-');
    if (ALLOWED_SLUGS.includes(partSlug)) return partSlug;
  }

  // 3. Fallback: if no valid strict match, just return the first part cleaned
  return parts[0].toLowerCase().replace(/\s+/g, '-');
}

export async function getDesignsByTag(tag: string, limit: number = 20): Promise<Design[]> {
  if (USE_MOCK) {
    return mockDesigns.filter(d => d.tags && d.tags.includes(tag)).slice(0, limit)
  }

  const supabase = createServerSupabaseClient()

  // Prepare variations for search (Postgres array contains is case-sensitive)
  const variations = [tag];

  // 1. Capitalized version (e.g., 'anime' -> 'Anime')
  variations.push(tag.charAt(0).toUpperCase() + tag.slice(1));

  // 2. Space variation instead of hyphens (e.g., 'dia-del-padre' -> 'dia del padre')
  const spaceVariation = tag.replace(/-/g, ' ');
  variations.push(spaceVariation);

  // 3. Capitalized space variation (e.g., 'Día del Padre')
  const capitalizedSpace = spaceVariation.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  variations.push(capitalizedSpace);

  // 4. Specific Mappings from WordPress accurately identified by user
  if (tag === 'dia-del-amor-y-la-amistad') variations.push('Amor y Amistad');
  if (tag === 'dia-de-las-madres') variations.push('Día de las Madres');
  if (tag === 'dia-del-padre') variations.push('Día del Padre');
  if (tag === 'disney') variations.push('Disney');
  if (tag === 'anime') variations.push('Anime');
  if (tag === 'series') variations.push('Series');
  if (tag === 'peliculas') variations.push('Películas');
  if (tag === 'videojuegos') variations.push('Videojuegos');
  if (tag === 'logos') variations.push('Logos', 'Marcas');
  if (tag === 'png') variations.push('PNG');
  if (tag === 'psd') variations.push('PSD');
  if (tag === 'studio3') variations.push('Studio3', 'Silhouette');
  if (tag === 'baby-shower') variations.push('Baby Shower');
  if (tag === 'navidad') variations.push('Navidad');
  if (tag === 'cumpleanos') variations.push('Cumpleaños');

  // Remove duplicates
  const uniqueVariations = Array.from(new Set(variations));

  // Construct OR query with .contains matching any variation
  const orQuery = uniqueVariations.map(v => `tags.cs.{${v}}`).join(',');

  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .or(orQuery)
    .limit(limit)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching designs by tag:', error)
    return []
  }

  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (USE_MOCK) {
    return mockCategories.find(c => c.slug === slug) || null
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

// Get top categories by design count
export async function getTopCategories(limit: number = 6): Promise<Array<{ category: string; count: number }>> {
  if (USE_MOCK) {
    // Mock data for top categories
    return [
      { category: 'social-media', count: 245 },
      { category: 'video-templates', count: 167 },
      { category: 'presentations', count: 128 },
      { category: 'print-design', count: 112 },
      { category: 'fonts', count: 89 },
      { category: 'brand-kits', count: 56 },
    ].slice(0, limit)
  }

  try {
    const supabase = createServerSupabaseClient()

    // Get all designs' categories
    const { data, error } = await supabase
      .from('designs')
      .select('category')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    // Initialize counts for all allowed categories with zero
    const initialCounts: Record<string, number> = {}
    ALLOWED_SLUGS.forEach(slug => {
      initialCounts[slug] = 0
    })

    // Count designs per category from the designs fetched
    const categoryCounts = (data || []).reduce((acc, design) => {
      const categoryRaw = (design as { category: string }).category || 'uncategorized'

      // Split by comma to handle multiple categories per design
      const categories = categoryRaw.split(',').map(c => c.trim())

      categories.forEach(rawSubCat => {
        // Normalize each category to match slugs: lowercase, no accents, hyphenated
        const category = rawSubCat.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, '-')

        // Update count if it's one of our allowed categories
        if (acc.hasOwnProperty(category)) {
          acc[category] = (acc[category] || 0) + 1
        }
      })

      return acc
    }, initialCounts)

    // Convert to array and sort by count (descending) then alphabetically
    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
      .slice(0, limit)
  } catch (err) {
    console.error('Error fetching top categories:', err)
    return []
  }
}

// Get related designs by tags
export async function getRelatedDesignsByTags(
  designId: string,
  tags: string[],
  limit: number = 4
): Promise<Design[]> {
  if (USE_MOCK || tags.length === 0) {
    return []
  }

  try {
    const supabase = createServerSupabaseClient()

    // Get all designs except the current one
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .neq('id', designId)
      .limit(50) // Get more to filter by tags

    if (error) {
      console.error('Error fetching related designs:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Filter and score designs by matching tags
    const scoredDesigns = data
      .map(design => {
        const designTags = Array.isArray((design as Design).tags) ? (design as Design).tags : []
        const matchingTags = designTags.filter((tag: string) => tags.includes(tag))
        return {
          design,
          score: matchingTags.length
        }
      })
      .filter(item => item.score > 0) // Only designs with at least one matching tag
      .sort((a, b) => b.score - a.score) // Sort by most matching tags
      .slice(0, limit)
      .map(item => item.design)

    return scoredDesigns
  } catch (err) {
    console.error('Error fetching related designs by tags:', err)
    return []
  }
}

// Get popular categories for sidebar (alias for getTopCategories)
export async function getPopularCategories(limit: number = 5): Promise<Array<{ category: string; count: number }>> {
  return getTopCategories(limit)
}

// Get all unique tags from designs
export async function getAllTags(): Promise<string[]> {
  if (USE_MOCK) {
    const tagSet = new Set<string>();
    (mockDesigns as Design[]).forEach(d => d.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('designs')
      .select('tags')

    if (error) {
      console.error('Error fetching all tags:', error)
      return []
    }

    const tagSet = new Set<string>();
    (data as Array<{ tags: string[] | null }> | null)?.forEach(row => {
      const designTags = Array.isArray(row.tags) ? row.tags : [];
      designTags.forEach((t: string) => {
        if (t && t.length > 0) tagSet.add(t);
      });
    });

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'es'));
  } catch (err) {
    console.error('Error in getAllTags:', err)
    return []
  }
}
