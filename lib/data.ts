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
