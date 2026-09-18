export type DesignType = 'internal' | 'canva' | 'capcut' | 'font'
export type ContentType = 'asset' | 'blog' | 'tool'

export interface EditorTextFieldConfig {
  id: string
  label: string
  defaultText: string
  x: number
  y: number
  width?: number
  fontFamily: string
  fontFile?: string | null
  fontSize: number
  fill: string
  textAlign?: 'left' | 'center' | 'right'
  fontWeight?: string | number
  fontStyle?: 'normal' | 'italic'
}

export interface EditorConfig {
  version: 1
  canvas: {
    width: number
    height: number
    exportWidth?: number
    exportHeight?: number
  }
  backgroundUrl?: string | null
  textFields?: EditorTextFieldConfig[]
}

export interface Design {
  id: string
  title: string
  slug: string
  description: string
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  category: string
  tags: string[]
  download_url?: string | null
  is_vip: boolean
  downloads: number
  created_at: string
  updated_at: string

  // Current designs schema
  cost_in_credits?: number | null
  technical_type?: string | null
  software_recommended?: string | null
  alt_text?: string | null
  font_family?: string | null
  gallery_urls?: string[] | null
  related_keywords?: string[] | null
  content_type?: ContentType
  is_featured_month?: boolean
  is_editable?: boolean
  editor_type?: string | null
  editor_config?: EditorConfig | null
  json_ld_data?: Record<string, unknown> | null

  // Legacy compatibility while the migrated code is cleaned up.
  // These are not source-of-truth fields for new features.
  thumbnail_url?: string | null
  type?: DesignType
  external_url?: string | null
  premium_url?: string | null
}

/** Campos mínimos para tarjetas de diseño en grillas/catálogos.
 * NUNCA incluir: description, content, gallery_urls, related_keywords, download_url, etc. */
export type DesignCard = Pick<
  Design,
  | 'id'
  | 'title'
  | 'slug'
  | 'image_url'
  | 'category'
  | 'downloads'
  | 'alt_text'
  | 'excerpt'
  | 'font_family'
  | 'is_vip'
  | 'is_editable'
  | 'editor_type'
> & {
  type?: DesignType
  thumbnail_url?: string | null
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

export interface Taxonomy {
  id: string
  slug: string
  name: string
  description?: string | null
  type: 'category' | 'tag'
  seo_title?: string | null
  seo_description?: string | null
  created_at: string
  updated_at: string
  content_bottom?: string | null
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
      taxonomies: {
        Row: Taxonomy
        Insert: Omit<Taxonomy, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Taxonomy, 'id'>>
      }
      downloads_stats: {
        Row: {
          id: string
          design_id: string
          category: string
          created_at: string
        }
        Insert: {
          design_id: string
          category: string
        }
        Update: Partial<{
          design_id: string
          category: string
        }>
      }
    }
  }
}
