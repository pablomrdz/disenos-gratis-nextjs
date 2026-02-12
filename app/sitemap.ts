import { MetadataRoute } from 'next'
import { getDesigns } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://disenosgratis.com'

    // Fetch all designs for the sitemap
    const designs = await getDesigns({ limit: 1000 })

    const designUrls = designs.map((design) => ({
        url: `${baseUrl}/designs/${design.slug}`,
        lastModified: new Date(design.updated_at || design.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/designs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...designUrls,
    ]
}
