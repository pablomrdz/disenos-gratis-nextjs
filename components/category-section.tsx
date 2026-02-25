import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getTopCategories } from '@/lib/data'
import { slugify } from '@/lib/utils'

// Helper function to format category names
function formatCategoryName(slug: string): string {
  return slug
    .split(',')[0]
    .split(/[- ]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to get category color based on index
function getCategoryColor(index: number): string {
  const colors = [
    'text-blue-500 bg-blue-500/10',
    'text-primary-dark bg-primary/10', // Brand color
    'text-amber-500 bg-amber-500/10',
    'text-red-500 bg-red-500/10',
    'text-emerald-500 bg-emerald-500/10',
    'text-indigo-500 bg-indigo-500/10',
  ]
  return colors[index % colors.length]
}

export async function CategorySection() {
  const topCategories = await getTopCategories(6)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Explorar por Categoría
            </h2>
            <p className="mt-2 text-muted-foreground">
              Encuentra la plantilla perfecta para tu próximo proyecto
            </p>
          </div>
          <Link
            href="/designs"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCategories
            .filter(item => item.category.toLowerCase() !== 'blog')
            .map((item, index) => (
              <Link key={item.category} href={`/category/${slugify(item.category)}`}>
                <Card className="group h-full border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-lg ${getCategoryColor(index)}`}>
                      {formatCategoryName(item.category).charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {formatCategoryName(item.category)}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {item.count} diseños
                      </p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.count}
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
