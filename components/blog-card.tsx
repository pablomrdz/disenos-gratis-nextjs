import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { BlogPost } from '@/lib/types'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Card className="group overflow-hidden border-border/50 p-0 gap-0 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:min-h-[300px]">
            <Image
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          {/* Content */}
          <CardContent className="flex flex-col justify-center p-6 md:p-8">
            <Badge variant="secondary" className="w-fit">
              {post.category}
            </Badge>
            <Link href={`/blog/${post.slug}`} className="group/link mt-4">
              <h2 className="text-2xl font-bold text-foreground transition-colors group-hover/link:text-primary md:text-3xl">
                {post.title}
              </h2>
            </Link>
            <p className="mt-3 line-clamp-3 text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Read article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden border-border/50 p-0 gap-0 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.featured_image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Badge className="absolute right-3 top-3 bg-background/80 text-foreground backdrop-blur-sm">
          {post.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <Link href={`/blog/${post.slug}`} className="group/link">
          <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover/link:text-primary">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
