import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import { BlogCard } from '@/components/blog-card'
import { JsonLd } from '@/components/json-ld'
import { getBlogPostBySlug, getBlogPosts, getDesigns } from '@/lib/data'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post, allPosts, allDesigns] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
    getDesigns({ limit: 10 }),
  ])

  if (!post) {
    notFound()
  }

  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2)
  
  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd type="article" data={post} />

      {/* Breadcrumb */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Column */}
            <article className="flex-1 min-w-0">
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>

              {/* Featured Image */}
              <div className="overflow-hidden rounded-xl border border-border/50 bg-muted">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.featured_image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              </div>

              {/* Post Header */}
              <div className="mt-8">
                <Badge variant="secondary">{post.category}</Badge>
                <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-6 text-foreground leading-relaxed">
                  {post.content}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8 border-t border-border/50 pt-8">
                <h2 className="text-sm font-medium text-muted-foreground">Tagged with:</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-transparent">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Author Box */}
              <div className="mt-8 rounded-lg border border-border/50 bg-muted/30 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <p className="text-sm text-muted-foreground">Content Creator at DesignHub</p>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-xl font-bold text-foreground">Related Articles</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {relatedPosts.map((p) => (
                      <BlogCard key={p.id} post={p} />
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar - Moves below main content on mobile */}
            <div className="w-full lg:w-[300px]">
              <Sidebar popularDesigns={popularDesigns} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
