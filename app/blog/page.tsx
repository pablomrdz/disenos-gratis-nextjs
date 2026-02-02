import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { BlogCard } from '@/components/blog-card'
import { Sidebar } from '@/components/sidebar'
import { AdSlot } from '@/components/ad-slot'
import { getBlogPosts, getDesigns } from '@/lib/data'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog - Design Tips, Trends & Tutorials',
  description: 'Read our latest articles on design trends, tips, and tutorials. Learn how to create better designs and grow your creative skills.',
}

export default async function BlogPage() {
  const [posts, allDesigns] = await Promise.all([
    getBlogPosts(),
    getDesigns({ limit: 10 }),
  ])

  const [featuredPost, ...otherPosts] = posts
  const popularDesigns = [...allDesigns].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Blog
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Design tips, trends, and tutorials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Ad */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdSlot variant="hero" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            {/* Blog Content */}
            <div>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-12">
                  <h2 className="mb-6 text-lg font-semibold text-foreground">Featured Article</h2>
                  <BlogCard post={featuredPost} featured />
                </div>
              )}

              {/* Other Posts */}
              {otherPosts.length > 0 && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-foreground">Latest Articles</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {otherPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {posts.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    No blog posts available yet.
                  </p>
                </div>
              )}

              {/* Inline Ad */}
              <div className="mt-8">
                <AdSlot variant="inline" />
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
