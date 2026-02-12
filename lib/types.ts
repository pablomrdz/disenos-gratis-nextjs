export type DesignType = 'internal' | 'canva' | 'capcut' | 'font'

export interface Design {
  id: string
  title: string
  description: string
  slug: string
  thumbnail_url: string
  image_url?: string
  category: string
  type: DesignType
  download_url?: string | null
  external_url?: string | null
  premium_url?: string | null
  is_vip: boolean
  downloads: number
  created_at: string
  updated_at: string
  tags: string[]
}

export interface Tutorial {
  id: string
  title: string
  description: string
  slug: string
  youtube_embed_url: string
  thumbnail_url: string
  pinterest_url?: string | null
  tiktok_url?: string | null
  category: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  author: string
  category: string
  created_at: string
  updated_at: string
  tags: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      designs: {
        Row: Design
        Insert: Omit<Design, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Design, 'id'>>
      }
      tutorials: {
        Row: Tutorial
        Insert: Omit<Tutorial, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Tutorial, 'id'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BlogPost, 'id'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id'>
        Update: Partial<Omit<Category, 'id'>>
      }
    }
  }
}
