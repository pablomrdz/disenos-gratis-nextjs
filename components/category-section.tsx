import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTopCategories } from '@/lib/data'
import { slugify, getCategoryIcon } from '@/lib/utils'

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
    <section className="pt-4 pb-6 sm:py-8 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
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

        <div className="flex overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center gap-2 sm:gap-3 whitespace-nowrap">
          {topCategories.map((item) => (
            <Link
              key={item.category}
              href={`/${slugify(item.category)}`}
              className="group flex flex-none items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border/50 bg-card hover:bg-accent transition-all shadow-sm hover:shadow-md"
            >
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {getCategoryIcon(item.category, "h-3.5 w-3.5 sm:h-4 sm:w-4")}
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {formatCategoryName(item.category)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
