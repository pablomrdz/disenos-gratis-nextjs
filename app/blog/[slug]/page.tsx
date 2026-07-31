import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import AdUnit from '@/components/AdUnit'
import { JsonLd } from '@/components/json-ld'
import { getDesignBySlug, getPopularCategories } from '@/lib/data'
import { RichText } from '@/components/rich-text'
import { StickySidebar } from '@/components/sticky-sidebar'
import { createServerSupabaseClient } from '@/lib/supabase'

// ISR: Static with 7 days revalidation
export const revalidate = 604800

/**
 * Pre-genera todos los artículos de blog en tiempo de build (SSG)
 * para eliminar el renderizado dinámico en servidor.
 */
export async function generateStaticParams() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: posts } = await supabase
      .from('designs')
      .select('slug')
      .eq('category', 'blog')

    if (!posts || posts.length === 0) return []

    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for blog:', error)
    return []
  }
}

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
  const [post, popularCategories] = await Promise.all([
    getDesignBySlug(slug),
    getPopularCategories(6)
  ])

  if (!post) {
    notFound()
  }

  const title = post.title || 'Untitled Post'
  const createdAt = post.created_at ? new Date(post.created_at) : new Date()
  const tags = Array.isArray(post.tags) ? post.tags : []

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
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* Main Column */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 max-w-3xl mx-auto lg:mx-0">
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
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
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
              <div className="min-h-[250px] w-full flex justify-center overflow-hidden my-6">
                <AdUnit
                  slot="9549519747"
                  format="auto"
                  style={{ display: "block" }}
                  className="w-full"
                />
              </div>

              {/* Content */}
              <div className="mt-6 text-foreground/90">
                {post.content && post.content.trim().length > 0 ? (
                  <RichText content={post.content} />
                ) : (
                  <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none prose-a:text-primary prose-a:font-semibold hover:prose-a:underline">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {post.description || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Bottom Ad */}
              <div className="min-h-[250px] w-full flex justify-center overflow-hidden my-6">
                <AdUnit
                  slot="9549519747"
                  format="auto"
                  style={{ display: "block" }}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
              <StickySidebar
                popularCategories={popularCategories}
                tags={tags}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}