import type { Design, BlogPost, Tutorial } from '@/lib/types'

const BASE_URL = 'https://disenosgratis.com'
const SITE_NAME = 'Diseños Gratis'

interface JsonLdProps {
  type: 'product' | 'article'
  data: Design | BlogPost | Tutorial
}

export function JsonLd({ type, data }: JsonLdProps) {
  let structuredData: Record<string, unknown>

  if (type === 'product' && 'downloads' in data) {
    const design = data as Design
    const title = design.title || 'Untitled Design'
    const description = design.description?.replace(/<[^>]*>/g, '').slice(0, 300) || 'Recurso gráfico gratuito'
    const slug = design.slug || design.id
    const tags = Array.isArray(design.tags) ? design.tags : []
    const isTemplate = design.type === 'canva' || design.type === 'capcut'
    const isVip = Boolean(design.premium_url) || design.is_vip
    const imageUrl = design.image_url || design.thumbnail_url || undefined

    // Use SoftwareApplication for templates, Product for other designs
    if (isTemplate) {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        description: description,
        image: imageUrl ? {
          '@type': 'ImageObject',
          url: imageUrl,
          name: title,
          contentUrl: imageUrl,
        } : undefined,
        url: `${BASE_URL}/designs/${slug}`,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        datePublished: design.created_at || undefined,
        dateModified: design.updated_at || design.created_at || undefined,
        offers: {
          '@type': 'Offer',
          price: isVip ? '9.99' : '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: (design.downloads ?? 0) > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: design.downloads ?? 1,
          bestRating: '5',
          worstRating: '1',
        } : undefined,
        author: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
        keywords: tags.length > 0 ? tags.join(', ') : undefined,
      }
    } else {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: description,
        image: imageUrl ? {
          '@type': 'ImageObject',
          url: imageUrl,
          name: title,
          contentUrl: imageUrl,
        } : undefined,
        url: `${BASE_URL}/designs/${slug}`,
        category: design.category || 'Recursos Gráficos',
        datePublished: design.created_at || undefined,
        dateModified: design.updated_at || design.created_at || undefined,
        offers: {
          '@type': 'Offer',
          price: isVip ? '9.99' : '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/designs/${slug}`,
        },
        aggregateRating: (design.downloads ?? 0) > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: design.downloads ?? 1,
          bestRating: '5',
          worstRating: '1',
        } : undefined,
        brand: {
          '@type': 'Brand',
          name: SITE_NAME,
        },
        keywords: tags.length > 0 ? tags.join(', ') : undefined,
      }
    }
  } else if ('content' in data) {
    const post = data as BlogPost
    const title = post.title || 'Untitled Article'
    const excerpt = post.excerpt || post.content?.slice(0, 160) || 'Lee más en Diseños Gratis'
    const slug = post.slug || post.id
    const tags = Array.isArray(post.tags) ? post.tags : []

    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: excerpt,
      image: post.featured_image || undefined,
      url: `${BASE_URL}/blog/${slug}`,
      datePublished: post.created_at || undefined,
      dateModified: post.updated_at || post.created_at || undefined,
      author: {
        '@type': 'Person',
        name: post.author || 'Equipo Diseños Gratis',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/blog/${slug}`,
      },
      keywords: tags.length > 0 ? tags.join(', ') : undefined,
      articleSection: post.category || 'Recursos Gráficos',
    }
  } else {
    const tutorial = data as Tutorial
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: tutorial.title,
      description: tutorial.description,
      image: tutorial.thumbnail_url,
      url: `${BASE_URL}/tutorials/${tutorial.slug}`,
      datePublished: tutorial.created_at,
      dateModified: tutorial.updated_at,
      author: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo.png`,
        },
      },
      video: {
        '@type': 'VideoObject',
        name: tutorial.title,
        description: tutorial.description,
        thumbnailUrl: tutorial.thumbnail_url,
        embedUrl: tutorial.youtube_embed_url,
      },
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Organization JSON-LD for the website
export function OrganizationJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Recursos gráficos gratuitos y premium para diseñadores y creadores.',
    sameAs: [
      'https://pinterest.com/disenosgratis',
      'https://tiktok.com/@disenosgratis',
      'https://instagram.com/disenosgratis',
      'https://youtube.com/@disenosgratis',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hola@disenosgratis.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// WebSite JSON-LD for search functionality
export function WebsiteJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
