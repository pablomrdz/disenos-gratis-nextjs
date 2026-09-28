import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ALLOWED_SLUGS, getAllTags, getPrimaryCategory } from '@/lib/data'
import { slugify } from '@/lib/utils'

const BASE_URL = 'https://disenosgratis.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // ── Static routes ──────────────────────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/designs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/tags`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/en/dtf/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/en/tools/dtf-press-settings/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/en/tools/dtf-size-guide/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
    ]

    // ── Category routes (from ALLOWED_SLUGS, excluding "blog") ────
    const categoryRoutes: MetadataRoute.Sitemap = ALLOWED_SLUGS
        .filter((slug) => slug !== 'blog')
        .map((slug) => ({
            url: `${BASE_URL}/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))

    // ── Current semantic tag routes ────────────────────────────────
    // getAllTags() reads the cleaned tags[] column, so these URLs are
    // backed by at least one asset. /tags/png is intentionally kept as
    // a legacy format landing resolved from technical_type.
    let tagRoutes: MetadataRoute.Sitemap = []

    try {
        const tags = await getAllTags()
        const tagSlugs = new Set(tags.map((tag) => slugify(tag)))
        tagSlugs.add('png')

        tagRoutes = Array.from(tagSlugs).map((slug) => ({
            url: `${BASE_URL}/tags/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: slug === 'png' ? 0.8 : 0.7,
        }))
    } catch (err) {
        console.error('[Sitemap] Unexpected error fetching tags:', err)
    }

    // ── Dynamic asset + blog routes from Supabase ─────────────────
    let designRoutes: MetadataRoute.Sitemap = []
    let blogRoutes: MetadataRoute.Sitemap = []

    try {
        const supabase = createServerSupabaseClient()

        const { data: assets, error: assetsError } = await supabase
            .from('designs')
            .select('slug, category, updated_at')
            .eq('content_type', 'asset')
            .order('created_at', { ascending: false })
            .limit(5000)

        if (assetsError) {
            console.error('[Sitemap] Error fetching assets:', assetsError.message)
        }

        if (assets && assets.length > 0) {
            const designs = assets as Array<{ slug: string; category: string; updated_at: string | null }>
            designRoutes = designs.map((design) => {
                const primaryCategory = getPrimaryCategory(design.category)
                return {
                    url: `${BASE_URL}/${primaryCategory}/${design.slug}`,
                    lastModified: new Date(design.updated_at || new Date()),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }
            })
        }

        const { data: posts, error: postsError } = await supabase
            .from('designs')
            .select('slug, updated_at')
            .eq('content_type', 'blog')
            .order('created_at', { ascending: false })
            .limit(5000)

        if (postsError) {
            console.error('[Sitemap] Error fetching blog posts:', postsError.message)
        }

        if (posts && posts.length > 0) {
            const blogPosts = posts as Array<{ slug: string; updated_at: string | null }>
            blogRoutes = blogPosts.map((post) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at || new Date()),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            }))
        }
    } catch (err) {
        console.error('[Sitemap] Unexpected error:', err)
    }

    return [
        ...staticRoutes,
        ...categoryRoutes,
        ...tagRoutes,
        ...designRoutes,
        ...blogRoutes,
    ]
}
