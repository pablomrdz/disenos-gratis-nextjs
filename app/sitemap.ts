import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ALLOWED_SLUGS, getPrimaryCategory } from '@/lib/data'

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
    ]

    // ── Category routes (from ALLOWED_SLUGS, excluding "blog") ────
    const categoryRoutes: MetadataRoute.Sitemap = ALLOWED_SLUGS
        .filter((slug) => slug !== 'blog')
        .map((slug) => ({
            url: `${BASE_URL}/category/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))

    // ── Dynamic design routes from Supabase ────────────────────────
    let designRoutes: MetadataRoute.Sitemap = []

    try {
        const supabase = createServerSupabaseClient()

        const { data, error } = await supabase
            .from('designs')
            .select('slug, category, updated_at')
            .order('created_at', { ascending: false })
            .limit(5000)

        if (error) {
            console.error('[Sitemap] Error fetching designs:', error.message)
        }

        if (data && data.length > 0) {
            const designs = data as Array<{ slug: string; category: string; updated_at: string | null }>
            designRoutes = designs.map((design) => {
                const primaryCategory = getPrimaryCategory(design.category);
                return {
                  url: `${BASE_URL}/${primaryCategory}/${design.slug}`,
                  lastModified: new Date(design.updated_at || new Date()),
                  changeFrequency: 'weekly' as const,
                  priority: 0.8,
                }
            })
        }
    } catch (err) {
        console.error('[Sitemap] Unexpected error:', err)
    }

    return [...staticRoutes, ...categoryRoutes, ...designRoutes]
}
