import Link from 'next/link'
import { Share2, Presentation, Type, Video, Palette, Printer, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { 
    name: 'Social Media', 
    slug: 'social-media', 
    description: 'Instagram, TikTok, and more',
    icon: Share2,
    count: 245,
    color: 'text-pink-500 bg-pink-500/10',
  },
  { 
    name: 'Presentations', 
    slug: 'presentations', 
    description: 'Professional templates',
    icon: Presentation,
    count: 128,
    color: 'text-blue-500 bg-blue-500/10',
  },
  { 
    name: 'Fonts', 
    slug: 'fonts', 
    description: 'Premium and free fonts',
    icon: Type,
    count: 89,
    color: 'text-amber-500 bg-amber-500/10',
  },
  { 
    name: 'Video Templates', 
    slug: 'video-templates', 
    description: 'CapCut and video editing',
    icon: Video,
    count: 167,
    color: 'text-red-500 bg-red-500/10',
  },
  { 
    name: 'Brand Kits', 
    slug: 'brand-kits', 
    description: 'Complete branding packages',
    icon: Palette,
    count: 56,
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  { 
    name: 'Print Design', 
    slug: 'print-design', 
    description: 'Flyers, posters, and more',
    icon: Printer,
    count: 112,
    color: 'text-indigo-500 bg-indigo-500/10',
  },
]

export function CategorySection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find the perfect template for your next project
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card className="group h-full border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {category.count}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
