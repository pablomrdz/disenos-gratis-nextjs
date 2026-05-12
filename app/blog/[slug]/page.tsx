import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import { AdBanner } from '@/components/ad-banner'
import { JsonLd } from '@/components/json-ld'
import { getDesignBySlug, getDesigns } from '@/lib/data'

// ISR: Static with 1 hour revalidation
export const revalidate = 3600

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getDesignBySlug(slug)

  if (!post) {
    return { title: 'Artículo no encontrado' }
  }

  const title = post.title || 'Blog Post'
  const rawDescription = (post.description || '').replace(/<[^>]*>/g, '').slice(0, 160)
  const ogImage = post.image_url || post.thumbnail_url || ''

  return {
    title: `${title} | Blog - Diseños Gratis`,
    description: rawDescription,
    alternates: {
      canonical: `https://disenosgratis.com/blog/${slug}`,
    },
    openGraph: {
      title,
      description: rawDescription,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
      type: 'article',
      locale: 'es_MX',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: rawDescription,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post, allDesigns] = await Promise.all([
    getDesignBySlug(slug),
    getDesigns({ limit: 10, excludeCategory: 'blog' }),
  ])

  if (!post) {
    notFound()
  }

  const title = post.title || 'Untitled Post'
  const createdAt = post.created_at ? new Date(post.created_at) : new Date()
  const popularDesigns = [...allDesigns].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 5)

  return (
    <>
      <JsonLd type="article" data={post} />

      {/* Breadcrumb */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Inicio
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="line-clamp-1 text-foreground font-medium">{title}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Main Column */}
            <div className="max-w-3xl">
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Blog
              </Link>

              {/* Featured Image */}
              {(post.image_url || post.thumbnail_url) && (
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm mb-8">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={post.image_url || post.thumbnail_url || '/placeholder.svg'}
                      alt={post.alt_text || title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                </div>
              )}

              {/* Title & Meta */}
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl font-serif text-balance">
                {title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="bg-transparent capitalize">
                  Blog
                </Badge>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {createdAt.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* Ad */}
              <div className="min-h-[100px] w-full flex justify-center overflow-hidden my-6">
                <AdBanner slot="9549519747" responsive={true} />
              </div>

              {/* Content */}
              <div className="font-serif text-lg leading-relaxed text-foreground/90">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-a:text-primary prose-a:font-semibold hover:prose-a:underline">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {post.description || ''}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Bottom Ad */}
              <div className="min-h-[100px] w-full flex justify-center overflow-hidden my-6">
                <AdBanner slot="9549519747" responsive={true} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <Sidebar popularDesigns={popularDesigns} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
