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
      query = query.eq('category', options.category)
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
    return mockCategories
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

    // Get all designs and count by category
    const { data, error } = await supabase
      .from('designs')
      .select('category')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    // Count designs per category
    const categoryCounts = (data || []).reduce((acc, design) => {
      const category = (design as { category: string }).category || 'uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert to array and sort by count
    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
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
