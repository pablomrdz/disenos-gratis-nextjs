import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ALLOWED_SLUGS, getPrimaryCategory } from '@/lib/data'
import { getAllAssetTags } from '@/lib/tag-resolver'
import { slugify } from '@/lib/utils'

const BASE_URL = 'https://disenosgratis.com'

function canonicalUrl(path: string): string {
    const normalizedPath = path.replace(/^\/+|\/+$/g, '')
    return normalizedPath ? `${BASE_URL}/${normalizedPath}/` : `${BASE_URL}/`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: canonicalUrl(''),
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: canonicalUrl('designs'),
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: canonicalUrl('mockups'),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: canonicalUrl('blog'),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: canonicalUrl('tags'),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: canonicalUrl('about'),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: canonicalUrl('contact'),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: canonicalUrl('privacy'),
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: canonicalUrl('terms'),
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: canonicalUrl('en/dtf'),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: canonicalUrl('en/tools/dtf-press-settings'),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: canonicalUrl('en/tools/dtf-size-guide'),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
    ]

    const categoryRoutes: MetadataRoute.Sitemap = ALLOWED_SLUGS
        .filter((slug) => slug !== 'blog')
        .map((slug) => ({
            url: canonicalUrl(slug),
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))

    let tagRoutes: MetadataRoute.Sitemap = []

    try {
        // Keep sitemap and navigation aligned: only asset-backed tags are
        // published as semantic tag URLs. /tags/png remains a legacy format
        // landing resolved from technical_type.
        const tags = await getAllAssetTags()
        const tagSlugs = new Set(tags.map((tag) => slugify(tag)))
        tagSlugs.add('png')

        tagRoutes = Array.from(tagSlugs).map((slug) => ({
            url: canonicalUrl(`tags/${slug}`),
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: slug === 'png' ? 0.8 : 0.7,
        }))
    } catch (err) {
        console.error('[Sitemap] Unexpected error fetching tags:', err)
    }

    let designRoutes: MetadataRoute.Sitemap = []
    let blogRoutes: MetadataRoute.Sitemap = []
    let mockupRoutes: MetadataRoute.Sitemap = []

    try {
        const supabase = createServerSupabaseClient()

        const { data: mockups, error: mockupsError } = await supabase
            .from('mockup_templates')
            .select('slug, updated_at')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (mockupsError) {
            console.error('[Sitemap] Error fetching mockups:', mockupsError.message)
        }

        if (mockups && mockups.length > 0) {
            mockupRoutes = mockups.map((mockup) => ({
                url: canonicalUrl(`mockups/${mockup.slug}`),
                lastModified: new Date(mockup.updated_at || new Date()),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            }))
        }

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
                    url: canonicalUrl(`${primaryCategory}/${design.slug}`),
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
                url: canonicalUrl(`blog/${post.slug}`),
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
        ...mockupRoutes,
        ...designRoutes,
        ...blogRoutes,
    ]
}
