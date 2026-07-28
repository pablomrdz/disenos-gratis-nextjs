import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/', '/static/', '/search', '/search/'],
        },
        sitemap: 'https://disenosgratis.com/sitemap.xml',
    }
}
