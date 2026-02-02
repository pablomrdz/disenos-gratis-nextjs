import type { Design, BlogPost, Tutorial } from '@/lib/types'

interface JsonLdProps {
  type: 'product' | 'article'
  data: Design | BlogPost | Tutorial
}

export function JsonLd({ type, data }: JsonLdProps) {
  let structuredData: Record<string, unknown>

  if (type === 'product' && 'downloads' in data) {
    const design = data as Design
    const title = design.title || 'Untitled Design'
    const description = design.description || 'Premium design template'
    const slug = design.slug || design.id
    const tags = Array.isArray(design.tags) ? design.tags : []
    const isTemplate = design.type === 'canva' || design.type === 'capcut'
    const isVip = Boolean(design.premium_url) || design.is_vip
    
    // Use SoftwareApplication for templates, Product for other designs
    if (isTemplate) {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        description: description,
        image: design.thumbnail_url || undefined,
        url: `https://designhub.com/designs/${slug}`,
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
          name: 'DesignHub',
        },
        keywords: tags.length > 0 ? tags.join(', ') : undefined,
      }
    } else {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: description,
        image: design.thumbnail_url || undefined,
        url: `https://designhub.com/designs/${slug}`,
        category: design.category || 'Design',
        datePublished: design.created_at || undefined,
        dateModified: design.updated_at || design.created_at || undefined,
        offers: {
          '@type': 'Offer',
          price: isVip ? '9.99' : '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://designhub.com/designs/${slug}`,
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
          name: 'DesignHub',
        },
        keywords: tags.length > 0 ? tags.join(', ') : undefined,
      }
    }
  } else if ('content' in data) {
    const post = data as BlogPost
    const title = post.title || 'Untitled Article'
    const excerpt = post.excerpt || post.content?.slice(0, 160) || 'Read more on DesignHub'
    const slug = post.slug || post.id
    const tags = Array.isArray(post.tags) ? post.tags : []
    
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: excerpt,
      image: post.featured_image || undefined,
      url: `https://designhub.com/blog/${slug}`,
      datePublished: post.created_at || undefined,
      dateModified: post.updated_at || post.created_at || undefined,
      author: {
        '@type': 'Person',
        name: post.author || 'DesignHub Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'DesignHub',
        logo: {
          '@type': 'ImageObject',
          url: 'https://designhub.com/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://designhub.com/blog/${slug}`,
      },
      keywords: tags.length > 0 ? tags.join(', ') : undefined,
      articleSection: post.category || 'Design Tips',
    }
  } else {
    const tutorial = data as Tutorial
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: tutorial.title,
      description: tutorial.description,
      image: tutorial.thumbnail_url,
      url: `https://designhub.com/tutorials/${tutorial.slug}`,
      datePublished: tutorial.created_at,
      dateModified: tutorial.updated_at,
      author: {
        '@type': 'Organization',
        name: 'DesignHub',
      },
      publisher: {
        '@type': 'Organization',
        name: 'DesignHub',
        logo: {
          '@type': 'ImageObject',
          url: 'https://designhub.com/logo.png',
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
    name: 'DesignHub',
    url: 'https://designhub.com',
    logo: 'https://designhub.com/logo.png',
    description: 'Premium digital assets marketplace for creators and designers.',
    sameAs: [
      'https://pinterest.com/designhub',
      'https://tiktok.com/@designhub',
      'https://instagram.com/designhub',
      'https://youtube.com/@designhub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@designhub.com',
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
    name: 'DesignHub',
    url: 'https://designhub.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://designhub.com/search?q={search_term_string}',
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
