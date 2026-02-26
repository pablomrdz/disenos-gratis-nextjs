import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTopCategories } from '@/lib/data'
import { slugify, getCategoryIcon, getCategoryColor } from '@/lib/utils'

// Helper function to format category names
function formatCategoryName(slug: string): string {
  return slug
    .split(',')[0]
    .split(/[- ]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function CategorySection() {
  const topCategories = await getTopCategories(12) // Fetch more for pills

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Explorar Categorías
          </h2>
          <Link
            href="/designs"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto pb-8 pt-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-wrap gap-3 min-w-max sm:min-w-0 py-2 px-2">
            {topCategories
              .filter(item => item.category.toLowerCase() !== 'blog')
              .map((item) => (
                <Link
                  key={item.category}
                  href={`/category/${slugify(item.category)}`}
                  className="group"
                >
                  <div className="flex items-center gap-2 rounded-full px-4 py-2 border border-border/50 bg-white transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:scale-105 select-none whitespace-nowrap">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${getCategoryColor(item.category)}`}>
                      {getCategoryIcon(item.category, "h-3.5 w-3.5")}
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary">
                      {formatCategoryName(item.category)}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
